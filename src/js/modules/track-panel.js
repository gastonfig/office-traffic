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
		this._panelDotRadius = 1;
		this._data = data;

		this.dataKeys = Object.keys(data);
		this.maxMinutes = this._getMaxMins();

		this._getMaxMins();
		this._setCanvasProps();

		window.addEventListener('resize', function() {
			this.resetTimePanel();
		}.bind(this));
	};

	TrackPanel.prototype._setCanvasProps = function () {
		// Screen With and Height
		this._canvasWidth = window.innerWidth;
		this._canvasHeight = window.innerHeight;
		this._panelHeight = 80; // TODO: Hardcoded for now
		this._centerY = this._canvasHeight / 2;
		this._centerX = this._canvasWidth / 2;
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

	TrackPanel.prototype.resetTimePanel = function () {
		this._setCanvasProps();
		this._panelSvg.innerHTML = '';
		this.addTimePanel();
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
		// TODO: Hack, fix me: 5 pixels account for the tracker's width
		this._playHead.style.width = 0 + '%'; 
	};

	TrackPanel.prototype._appendTimePanelGroup = function (index, key) {
		// Creates the group
		var groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		var dataListSegment = this._data[key];

		// groupElement
		groupElement.setAttribute(
			'transform', 'translate(0, ' + ((index + this._panelDotRadius) * 14) + ')'
		);

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
		var circleY = 10; // TODO: Hardcoded for now

		circle.setAttribute('r', this._panelDotRadius);
		circle.setAttribute('fill', constants.colors[dataIndex]);
		circle.setAttribute('cx', circleX);
		circle.setAttribute('cy', circleY);

		// Appends group to Time Panel
		groupElement.appendChild(circle);
	};

	return TrackPanel;
});