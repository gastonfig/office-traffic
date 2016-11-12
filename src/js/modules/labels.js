/**
 * Labels
 */
define(['moment'], function (moment) {
	'use strict';

	var Labels = function () {
		this._timeLabel = document.querySelector('.stats_time');
		this._hitsLabel = document.querySelector('.stats_count');
		this._hits = 0;
		this._startTime = '2015-10-16 08:32:59';
	};

	// Updates the timer label
	Labels.prototype.updateTime = function (timer) {
		var newTime = moment(this._startTime).add(timer, 'minutes');

		this._timeLabel.innerHTML = moment(newTime).format('hh:mm') +
			'<span>' + moment(newTime).format('a') + '</span>';
	};

	// Updates the number of hits label
	Labels.prototype.updateHitsLabel = function () {
		this._hits++;
		this._hitsLabel.innerHTML = this._hits;
	};

	// Updates the number of hits label
	Labels.prototype.resetHitsLabel = function () {
		this._hits = 0;
		this._hitsLabel.innerHTML = this._hits;
	};

	// Updates the number of hits label
	Labels.prototype.resetTimerLabel = function () {    
		this.updateTime(0);
	};

	return Labels;
});