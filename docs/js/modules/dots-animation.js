/**
 * Dots Animation
 */
define([
		'TweenMax',
		'modules/constants'
	], function (
		TweenMax,
		constants) {
	'use strict';

	var DotsAnimation = function () {
		this._TweenMax = TweenMax;
		this._constants = constants;
	};

	DotsAnimation.prototype.animateDots = function (key) {
		var bigDot = '.ring__' + key;
		var centerDot = '.dot__' + key;

		// CIRCLES
		this._TweenMax.fromTo(
			bigDot, 0.7,
			{attr: {r: 0}, opacity: 0.6},
			{attr: {r: 100}, opacity: 0, ease: Sine.easeInOut}
		);

		// DOTS
		this._TweenMax.fromTo(
			centerDot, 0.1,
			{attr: {r: 3}},
			{attr: {r: 5}, yoyo: true, repeat: 1}
		);
	};

	return DotsAnimation;
});