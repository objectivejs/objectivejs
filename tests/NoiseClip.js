/**
 *
 * @copyright  2021 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function NoiseClip() {
	ProgramClip.call(this);

	this._interval = NoiseClip.playbackRate;

	this._imageData = null;
}

NoiseClip.prototype = Object.create(ProgramClip.prototype);

Object.defineProperty(NoiseClip.prototype, 'constructor', { value: NoiseClip, enumerable: false, writable: true });

NoiseClip.playbackRate = 100;

Object.assign(NoiseClip.prototype, Draggable.prototype);

Object.defineProperty(NoiseClip.prototype, 'playbackRate', {
	get:	function() {
		return this._playbackRate;
	},
	set:	function(r) {
		if (typeof r !== 'number')
			throw new TypeError();

		if (r != NoiseClip.playbackRate)
			throw new RangeError();
	}
});

NoiseClip.prototype.enablePlayer = function() {
	if (this._player)
		return this;

	if (this._click === undefined) {
		this._click = (e) => {
			switch (e.type) {
				case 'click':
					if (this._dragged)
						break;

					if (this._paused)
						this.play();
					else
						this.pause();
					break;
			}
		};
	}

	if (this._keydown === undefined) {
		this._keydown = (e) => {
			e.preventDefault();

			switch (e.key) {
				case ' ':
					if (this._paused)
						this.play();
					else
						this.pause();
					break;
			}
		};
	}

	ProgramClip.prototype.enablePlayer.call(this);

	return this;
};

NoiseClip.prototype.setWidget = function(w) {
	if (w.tagName != 'CANVAS')
		throw new TypeError();

	if (w.width == 0 || w.height == 0)
		throw new TypeError();

	ProgramClip.prototype.setWidget.call(this, w);

	const ctx = w.getContext('2d');

	const imgdata = ctx.createImageData(w.width, w.height);

	const size = imgdata.width * imgdata.height * 4;

	for (let i = 0; i < size; i += 4)
		imgdata.data[i+3] = 255;

	this._imageData = imgdata;

	window.addEventListener('load', () => this.drawWidget());

	return this;
};

NoiseClip.prototype.drawWidget = function() {
	const imgdata = this._imageData;

	const size = imgdata.width * imgdata.height * 4;

	for (let i = 0; i < size; i += 4) {
		imgdata.data[i+0] = Math.random() > 0.5 ? 255 : 0;
		imgdata.data[i+1] = Math.random() > 0.5 ? 255 : 0;
		imgdata.data[i+2] = Math.random() > 0.5 ? 255 : 0;
	}

	const ctx = this._widget.getContext('2d');

	ctx.putImageData(imgdata, 0, 0);

	return this;
};
