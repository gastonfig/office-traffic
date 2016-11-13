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
		Labels,
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
		this._labels = new Labels();
		this._DotsAnimation = new DotsAnimation();
		this._TrackPanel = new TrackPanel();
		this._dataKeys = this._TrackPanel.dataKeys;
		this.maxMinutes = this._TrackPanel.maxMinutes;
		this._prev = {};

		var chorus = new Tone.Chorus(0.5, 1.5, 0.5).toMaster();

		this._playedEmpty = false; // For iOS. TODO: only do this on iOS devices
		this.iosInit = new Tone.Player({
			'url' : 'assets/empty.wav'
		}).toMaster(); 

		this._synthEnvelope = {
			attack: 0.016,
			decay: 1,
			sustain: 0.1,
			release: 0
		};

		this._synths = {
			first : new Tone.SimpleSynth({
				volume : -7,
				envelope : this._synthEnvelope
			}).connect(chorus),

			second : new Tone.SimpleSynth({
				volume : -7,
				envelope : this._synthEnvelope
			}).connect(chorus),

			third : new Tone.SimpleSynth({
				volume : -7,
				envelope : this._synthEnvelope
			}).connect(chorus)
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

				for(var i = 0; i < this._dataKeys.length; i++) {
					dataLoop(this._dataKeys[i]);
				}

				this._TrackPanel.movePlayHead(this._timer);
				this._labels.updateTime(this._timer);
				incrementTimer();
			}
		}.bind(this), '32n');
	};

	SoundPlayer.prototype.playSequence = function () {
		if(!this._playedEmpty) { //TODO: only do this on iOS devices
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

		this._labels.resetHitsLabel(); // TODO: Move to its own method in labels component.
		this._labels.resetTimerLabel(); // TODO: Move to its own method in labels component.
	};

	SoundPlayer.prototype.dataLoop = function (key) {
		var note;
		var synthName;
		var releaseTime = 4;
		var dataItem = this._data[key];

		for (var item in dataItem) {
			if(this._timer === dataItem[item].minutes) {
				synthName = dataItem[item].name;
				
				// Prevents the same note being played and animated more
				// than once for the same location at the same minute
				if(this._prev[synthName] !== dataItem[item].minutes) {
					note = Math.floor(Math.random() * this._constants.scale.length);
					this._synths[synthName].triggerAttackRelease(
						this._constants.scale[note], releaseTime + 'n'
					);

					this._DotsAnimation.animateDots(key);
					this._prev[synthName] = this._timer;
				}


				this._labels.updateHitsLabel();
			}
		}
	};

	SoundPlayer.prototype.shouldContinue = function () {
		return this._timer < this.maxMinutes;
	};

	return SoundPlayer;
});