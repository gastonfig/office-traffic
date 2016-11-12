/**
 * Dots Animation
 */
define([
		'modules/data',
		'modules/constants'
	], function (
		data,
		constants
	) {
	'use strict';

	var TrackPanel = function () {
		this._panelSvg = document.getElementsByClassName('time-panel__svg')[0];
		this._playHead = document.querySelector('.play-head');

		this._panelDotRadius = 1.5;
		this._data = data;

		// Screen With and Height
		this._canvasWidth = window.innerWidth;
		this._canvasHeight = window.innerHeight;
		this._panelHeight = 80;//this._canvasHeight * 0.05;
		this._centerY = this._canvasHeight / 2;
		this._centerX = this._canvasWidth / 2;
		this.dataKeys = Object.keys(data);
		this.maxMinutes = this._getMaxMins();
		
		this._getMaxMins();
	};

	TrackPanel.prototype._getMaxMins = function () {
		var minutes = [];

		for(var i = 0; i < this.dataKeys.length; i++) {
			var key = this.dataKeys[i];
			var obj = this._data[key];

			minutes.push(
				obj[obj.length - 1].minutes
			);
		}

		return Math.max.apply(null, minutes);
	};

	TrackPanel.prototype.addTimePanel = function () {
		this._panelSvg.setAttribute('height', '100%');
		this._panelSvg.setAttribute('width', '100%');
		this._panelSvg.setAttribute(
			'viewBox','0 0 '+ this._canvasWidth +' '+ this._panelHeight
		);
		this._panelSvg.setAttribute('preserveAspectRatio','xMinYMin');
		var dataArray = Object.keys(this._data);
		var dataLen = dataArray.length;
		
		// Create a group for each location
		for(var i = 0; i < dataLen; i++) {
			var key = dataArray[i];
			this._appendTimePanelGroup(i, key);
		}
	};
	
	TrackPanel.prototype.movePlayHead = function (timer) {
		var left = timer/this.maxMinutes * 100;
		this._playHead.style.width = left + '%';
	};

	TrackPanel.prototype.resetPlayHead = function () {   
		this._playHead.style.with = 0; // Hack, fix me: 5 pixels account for the tracker's width
	};

	TrackPanel.prototype._appendTimePanelGroup = function (index, key) {
		// Creates the group
		var groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		var dataListSegment = this._data[key];

		// groupElement
			// .setAttribute('class', 'container');
		groupElement.setAttribute('transform', 'translate(0, ' + ((index + this._panelDotRadius) * 14) + ')');

		// Appends group to Time Panel
		this._panelSvg.appendChild(groupElement);

		// Appends a circle for each record in that group
		for(var i = 0; i < dataListSegment.length; i++) {
			this._appendTimePanelCircle(groupElement, key, i, dataListSegment[i], index);
		}
	};

	TrackPanel.prototype._appendTimePanelCircle = function (
		groupElement,
		key,
		circleIndex,
		event,
		dataIndex
	) {
		// Creates the circle
		var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		var circleX = (event.minutes * this._canvasWidth / this.maxMinutes) +
			this._panelDotRadius;
		// var circleY = (dataIndex * this._panelHeight * 0.3) + 10;

		circle.setAttribute('r', this._panelDotRadius);
		circle.setAttribute('fill', constants.colors[dataIndex]);
		circle.setAttribute('cx', circleX);
		circle.setAttribute('cy', 10);

		// Appends group to Time Panel
		groupElement.appendChild(circle);
	};

	return TrackPanel;
});