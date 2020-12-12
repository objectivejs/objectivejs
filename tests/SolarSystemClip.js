/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function SolarSystemClip() {
	ProgramClip.call(this);

	this._width = this._height = 300;

	this._duration = 60*1000;
	this._interval = 40;

	this._sun = document.createElement('img');
	this._moon = document.createElement('img');
	this._earth = document.createElement('img');

	this._sun.src = '/objectivejs/tests/solarsystem_sun.png';
	this._moon.src = '/objectivejs/tests/solarsystem_moon.png';
	this._earth.src = '/objectivejs/tests/solarsystem_earth.png';

	this._ctx = null;
}

SolarSystemClip.prototype = Object.create(ProgramClip.prototype);

Object.defineProperty(SolarSystemClip.prototype, 'constructor', { value: SolarSystemClip, enumerable: false, writable: true });

SolarSystemClip.prototype.setWidget = function(w) {
	const canvas = document.createElement('canvas');

	canvas.width = this._width;
	canvas.height = this._height;

	const ctx = canvas.getContext('2d');

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, this._width, this._height);

	this._ctx = ctx;

	w.appendChild(canvas);

	Clip.prototype.setWidget.call(this, canvas);

	return this;
};

SolarSystemClip.prototype.drawWidget = function() {
	const ms = this._currentTime;
	const ctx = this._ctx;

	ctx.globalCompositeOperation = 'destination-over';
	ctx.clearRect(0, 0, 300, 300);

	ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
	ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
	ctx.save();
	ctx.translate(150, 150);

	// earth
	ctx.rotate(((2 * Math.PI) / 60000) * ms);
	ctx.translate(105, 0);
	ctx.fillRect(0, -12, 40, 24);	// shadow
	ctx.drawImage(this._earth, -12, -12);

	// moon
	ctx.save();
	ctx.rotate(((2 * Math.PI) / 6000) * ms);
	ctx.translate(0, 28.5);
	ctx.drawImage(this._moon, -3.5, -3.5);
	ctx.restore();

	ctx.restore();

	ctx.beginPath();
	ctx.arc(150, 150, 105, 0, Math.PI * 2, false);	// earth orbit
	ctx.stroke();

	ctx.drawImage(this._sun, 0, 0, 300, 300);

	return this;
};
