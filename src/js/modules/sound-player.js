/**
 * Sound Player
 */
define([
		'Tone',
		'modules/data',
		'modules/constants',
		'modules/labels',
		'modules/dots-animation',
		'modules/track-panel',

	], function (
		Tone,
		data,
		constants,
		labels,
		DotsAnimation,
		TrackPanel

	) {
	'use strict';

	var SoundPlayer = function () {
		this._normalTempo = 35; // BPM
		this._fastTempo = this._normalTempo * 2; // BPM
		this._tempo = this._normalTempo; // BPM
		this._data = data;
		this._timer = 0;
		this._constants = constants;
		this.maxMinutes = Math.max(
			this._data.moe[this._data.moe.length - 1].minutes, 
			this._data.gaston[this._data.gaston.length - 1].minutes, 
			this._data.john[this._data.john.length - 1].minutes
		);

		this._labels = new labels();
		this._DotsAnimation = new DotsAnimation();
		this._TrackPanel = new TrackPanel();


		var chorus = new Tone.Chorus(0.7, 2.5, 0.7).toMaster();

		this._playedEmpty = false; // For iOS
		this.iosInit = new Tone.Player({
			'url' : '/assets/empty.wav'
		}).toMaster(); 

		this._synthEnvelope = {
			attack: 0.006,
			decay: 0.6,
			sustain: 0.2,
			release: 1
		};

		this._synths = {
			gaston : new Tone.SimpleSynth({
				volume : 1,
				envelope : this._synthEnvelope
			})
				.connect(chorus),

			john : new Tone.SimpleSynth({
				volume : -2,
				envelope : this._synthEnvelope
			})
				.connect(chorus),

			moe : new Tone.SimpleSynth({
				volume : -2,
				envelope : this._synthEnvelope
			})
				.connect(chorus)
		};

		this.init();
	};

	SoundPlayer.prototype.init = function () {
		// Tempo
		this.setTempo(this._tempo);
		this.setUpSequence();
	};

	SoundPlayer.prototype.setTempo = function (newTempo) {
		this._tempo = newTempo || this._normalTempo;
		Tone.Transport.bpm.value = this._tempo;
	};

	SoundPlayer.prototype.setFastTempo = function () {
		this.setTempo(this._fastTempo);
	};

	SoundPlayer.prototype.setUpSequence = function () {
		var incrementTimer = this.incrementTimer.bind(this);
		var shouldContinue = this.shouldContinue.bind(this);
		var dataLoop = this.dataLoop.bind(this);

		Tone.Transport.scheduleRepeat(function() {
			if(shouldContinue()) {
				dataLoop(this._data.john, 'j');
				dataLoop(this._data.gaston, 'g');
				dataLoop(this._data.moe, 'm');

				this._TrackPanel.movePlayHead(this._timer);
				this._labels.updateTime(this._timer);
				incrementTimer();
			}
		}.bind(this), '32n');
	};

	SoundPlayer.prototype.playSequence = function () {
		if(!this._playedEmpty) {
			this._playedEmpty = true;
			this.iosInit.start();
		}
		
		Tone.Transport.start();
	};

	SoundPlayer.prototype.stopSequence = function () {
		Tone.Transport.stop();
		this.releaseAllSynths();
	};
	
	SoundPlayer.prototype.releaseAllSynths = function () {
		for(var synth in this._synths) {
			this._synths[synth].triggerRelease();      
		}
	};

	SoundPlayer.prototype.incrementTimer = function () {
		this._timer++;
	};

	SoundPlayer.prototype.resetTimer = function () {
		this._timer = 0;

		this._labels.resetHitsLabel(); // Fix me. This should be moved to its own method in the labels component.
		this._labels.resetTimerLabel(); // Fix me. This should be moved to its own method in the labels component.
	};

	SoundPlayer.prototype.dataLoop = function (dataItem, initial) {
		var note;
		var synthName;
		var releaseTime = 4;

		for (var item in dataItem) {
			if(this._timer === dataItem[item].minutes) {
				synthName = dataItem[item].name;

				note = Math.floor(Math.random() * this._constants.scale.length);
				this._synths[synthName].triggerAttackRelease(
					this._constants.scale[note], releaseTime + 'n'
				);
				this._DotsAnimation.animateDots('.map__' + initial, '.dot__' + initial);

				this._labels.updateHitsLabel();
			}
		}
	};

	SoundPlayer.prototype.shouldContinue = function () {
		return this._timer < this.maxMinutes;
	};

	return SoundPlayer;
});