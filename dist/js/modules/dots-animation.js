/**
 * Dots Animation
 */
define([
		'moment',
		'TweenMax'
	], function (
		moment,
		TweenMax) {
	'use strict';

	var DotsAnimation = function () {
		this._TweenMax = TweenMax;
	};

	DotsAnimation.prototype.animateDots = function (bigDot, centerDot) {
		this._TweenMax.fromTo(
			bigDot, 0.6, {attr:{r:2}, opacity: 0.6},
			{attr:{r: 100}, opacity: 0, ease: Sine.easeInOut}
		);
		this._TweenMax.fromTo(
			centerDot,0.1, {fill: '#fff', attr:{r:2}},
			{fill: '#09C4E6', attr:{r:5}, yoyo: true, repeat: 1}
		);
	};

	return DotsAnimation;
});