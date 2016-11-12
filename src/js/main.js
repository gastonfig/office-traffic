require.config({
	paths: {
		'Tone': 'vendor/Tone',
		'moment': 'vendor/moment.min',
		'TweenMax': 'vendor/TweenMax.min'
	}
});

require([
	'modules/sound-player',
	'modules/track-panel'

], function (
	SoundPlayer,
	TrackPanel
) {
	'use strict';

	var soundPlayer = new SoundPlayer();
	var trackPanel = new TrackPanel();
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

	var isModalOpen = false;
	var modalContaner = document.querySelector('.modal-container');
	var openModalBtn = document.querySelector('.modal-open');
	var closeModalBtn = document.querySelector('.modal-close');
	var toggleModalBtn = document.querySelectorAll('.modal-toggle');

	function toggleModal(evt) {
		evt.preventDefault();
		
		if(isModalOpen) {
			TweenMax.to(
				modalContaner, 0.3,
				{opacity: 0, autoAlpha: 0, ease: Sine.easeInOut}
			);
		} else {
			TweenMax.to(
				modalContaner, 0.3,
				{opacity: 1, autoAlpha: 1, ease: Sine.easeInOut}
			);
		}
		isModalOpen = !isModalOpen;
	}

	for(var i = 0; i <  toggleModalBtn.length; i++ ) {
		var modalBtn = toggleModalBtn[i];
		modalBtn.addEventListener('mousedown', toggleModal, false);
	}
});