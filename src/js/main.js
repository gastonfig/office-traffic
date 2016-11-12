require.config({
	paths: {
		'Tone': 'vendor/Tone',
		'moment': 'vendor/moment.min',
		'TweenMax': 'vendor/TweenMax.min'
	}
});

require([
	'modules/sound-player',
	'modules/track-panel',
	'modules/modal'

], function (
	SoundPlayer,
	TrackPanel,
	Modal
) {
	'use strict';

	var soundPlayer = new SoundPlayer();
	var trackPanel = new TrackPanel();
	var modal = new Modal();

	var isPlaying = false;
	var isFastTempo = false;
	
	trackPanel.addTimePanel();

	// Controls
	var playButton = document.querySelector('.playback_play');
	var stopButton = document.querySelector('.playback_stop');
	var rewindButton = document.querySelector('.playback_rewind');

	playButton.addEventListener('mousedown', function (evt) {
		evt.preventDefault();
		playButton.classList.toggle('playing');

		if(isPlaying) {			
			soundPlayer.stopSequence();
		} else {
			soundPlayer.playSequence();
		}
		
		isPlaying = !isPlaying;
	});

	stopButton.addEventListener('mousedown', function (evt) {
		evt.preventDefault();
		stopButton.classList.toggle('double');

		if(!isFastTempo) {
			soundPlayer.setFastTempo();
		} else {
			soundPlayer.setTempo();
		}

		isFastTempo = !isFastTempo;
	});

	rewindButton.addEventListener('mousedown', function (evt) {
		evt.preventDefault();

		playButton.classList.remove('playing');
		isPlaying = false;

		soundPlayer.stopSequence();
		trackPanel.resetPlayHead();
		soundPlayer.resetTimer();
	});
});