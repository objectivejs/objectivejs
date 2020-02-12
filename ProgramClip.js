/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function ProgramClip() {
	Clip.call(this);

	this._interval = 200;
	this._timer = null;
}

ProgramClip.prototype = Object.create(Clip.prototype);

Object.defineProperty(ProgramClip.prototype, 'constructor', { value: ProgramClip, enumerable: false, writable: true });

Object.defineProperty(ProgramClip.prototype, 'playbackRate', {
	get:	function() {
				return this._playbackRate;
			},
	set:	function(r) {
				if (typeof r !== 'number')
					throw new TypeError();

				if (r < Clip.minPlaybackRate || r > Clip.maxPlaybackRate)
					throw new RangeError();

				this._playbackRate = r;

				if (this._timer)
					this._startTimer();
			}
});

ProgramClip.prototype.drawWidget = function() {
	return this;
}

ProgramClip.prototype.setInterval = function(ms) {
	if (!Number.isInteger(ms))
		throw new TypeError();

	if (ms <= 0)
		throw new RangeError();

	if (this._interval == ms)
		return this;

	this._interval = ms;

	if (this._timer)
		this._startTimer();

	return this;
}

ProgramClip.prototype.seek = function(ms) {
	if (!Number.isInteger(ms))
		throw new TypeError();

	if (ms < 0)
		throw new RangeError();

	let duration = this.duration;

	if (ms > duration)
		ms = duration;

	this._currentTime = ms;

	this._ended = false;

	this.drawWidget();

	this.notify('clipSeeked', this);

	return this;
}

ProgramClip.prototype.play = function() {
	if (this._timer)
		return this;

	if (this._ended || this._currentTime == 0)
		this.seek(0);

	this._ended = this._paused = false;

	this._startTimer();

	return this;
}

ProgramClip.prototype.pause = function() {
	if (!this._timer)
		return this;

	this._paused = true;

	this._stopTimer();

	return this;
}

ProgramClip.prototype._startTimer = function() {
	if (this._timer)
		window.clearInterval(this._timer);

	const duration = this.duration;

	this._timer = window.setInterval(() => {
		this._currentTime = Math.min(duration, this._currentTime + this._interval);

		this.drawWidget();

		if (this._currentTime == duration) {
			window.clearInterval(this._timer);

			this._timer = null;

			this._ended = this._paused = true;

			this.notify('clipEnded', this);
		}
	}, Math.floor(this._interval / this._playbackRate));

	return this;
}

ProgramClip.prototype._stopTimer = function() {
	if (this._timer) {
		window.clearInterval(this._timer);

		this._timer = null;
	}

	return this;
}
