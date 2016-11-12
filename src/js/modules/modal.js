/**
 * Modal
 */
define([
		'TweenMax'
	], function (
		TweenMax
	) {
	'use strict';

	var Modal = function () {
		this._TweenMax = TweenMax;	
		this._isModalOpen = false;
		this._modalContainer = document.querySelector('.modal-container');
		this._toggleModalBtn = document.querySelectorAll('.modal-toggle');
		this._menuBtn = document.querySelector('.menu-btn');

		this._addToggleListener();
	};

	Modal.prototype._addToggleListener = function () {
		for(var i = 0; i <  this._toggleModalBtn.length; i++ ) {			
			var modalBtn = this._toggleModalBtn[i];
			modalBtn.addEventListener('mousedown', this.toggleModal.bind(this), false);
		}
	};

	Modal.prototype.toggleModal = function (evt) {
		evt.preventDefault();
		
		if(this._isModalOpen) {
			this._TweenMax.to(
				this._modalContainer, 0.3,
				{opacity: 0, autoAlpha: 0, ease: Sine.easeInOut}
			);
		} else {
			this._TweenMax.to(
				this._modalContainer, 0.3,
				{opacity: 1, autoAlpha: 1, ease: Sine.easeInOut}
			);
		}

		this._menuBtn.classList.toggle('is-open');
		this._isModalOpen = !this._isModalOpen;
	};

	return Modal;
});