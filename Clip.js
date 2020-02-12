/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function Clip() {
	View.call(this);

	this._width = this._height = 0;

	this._duration = 0;
	this._currentTime = 0;

	this._ended = false;
	this._paused = true;

	this._playbackRate = 1;

	this._player = false;
}

Clip.prototype = Object.create(View.prototype);

Object.defineProperty(Clip.prototype, 'constructor', { value: Clip, enumerable: false, writable: true });

Clip.minPlaybackRate = 0.25;
Clip.maxPlaybackRate = 5.0;

Object.defineProperty(Clip.prototype, 'dimension', {
	get:	function() {
				return [this._width, this._height];
			},
	set:	function(d) {
				if (! (Array.isArray(d) && d.length == 2))
					throw new TypeError();

				let [w, h] = d;

				if (!Number.isInteger(w) || !Number.isInteger(h))
					throw new TypeError();

				if (w < 0 || h < 0)
					throw new RangeError();

				this._width = w;
				this._height = h;
			}
});

Object.defineProperty(Clip.prototype, 'duration', {
	get:	function() {
				return this._duration;
			},
});

Object.defineProperty(Clip.prototype, 'ended', {
	get:	function() {
				return this._ended;
			}
});

Object.defineProperty(Clip.prototype, 'paused', {
	get:	function() {
				return this._paused;
			}
});

Object.defineProperty(Clip.prototype, 'currentTime', {
	get:	function() {
				return this._currentTime;
			}
});

Object.defineProperty(Clip.prototype, 'playbackRate', {
	get:	function() {
				return this._playbackRate;
			},
	set:	function(r) {
				if (typeof r !== 'number')
					throw new TypeError();

				if (r < Clip.minPlaybackRate || r > Clip.maxPlaybackRate)
					throw new RangeError();

				this._playbackRate = r;
			}
});

Clip.prototype.seek = function(ms) {
	return this;
}

Clip.prototype.play = function() {
	this._ended = this._paused = false;

	return this;
}

Clip.prototype.pause = function() {
	this._paused = true;

	return this;
}

Clip.prototype.hasPlayer = function() {
	return this._player;
}

Clip.prototype.enablePlayer = function() {
	if (this.hasPlayer())
		return this;

	if (this._mouseenter === undefined) {
		this._mouseenter = (e) => e.target.focus();
	}

	if (this._mouseleave === undefined) {
		this._mouseleave = (e) => e.target.blur();
	}

	if (this._click === undefined) {
		this._click = (e) => {
			switch (e.type) {
		    case 'click':
		    	if (this._paused)
		    		this.play();
		    	else
		    		this.pause();
		    	break;
			}
		}
	}

	if (this._keydown === undefined) {
		this._keydown = (e) => {
			e.preventDefault();

			let duration, currentTime, d, ms;

			switch (e.code) {
			case 'Space':
				if (this._paused)
					this.play();
				else
					this.pause();
				break;

			case 'Numpad0':
				this.seek(0);
				break;

			case 'NumpadAdd':
				if (this.playbackRate < Clip.maxPlaybackRate)
					this.playbackRate += 0.25;
				break;
			case 'NumpadSubtract':
				if (this.playbackRate > Clip.minPlaybackRate)
					this.playbackRate -= 0.25;
				break;
			case 'NumpadMultiply':
				this.playbackRate = 1;
				break;

			case 'ArrowRight':
			case 'ArrowUp':
				duration = this.duration;
				currentTime = this.currentTime;
				d = e.shiftKey ? 10000 : (e.ctrlKey ? 100 : 1000);
				ms = currentTime + d;
				if (ms >= duration)
					this.seek(ms % d);
				else
					this.seek(ms);
				break;
			case 'ArrowLeft':
			case 'ArrowDown':
				duration = this.duration;
				currentTime = this.currentTime;
				d = e.shiftKey ? 10000 : (e.ctrlKey ? 100 : 1000);
				ms = currentTime - d;
				if (ms < 0) {
					ms = Math.floor(duration / d) * d + currentTime;
					while (ms >= duration)
						ms -= d;
					this.seek(ms)
				}
				else
					this.seek(ms);
				break;
			}
		}
	}

	this.setAttribute('tabindex', 0);

	this.addEventListener('click', this._click);

	this.addEventListener('keydown', this._keydown);

	this.addEventListener('mouseenter', this._mouseenter);

	this.addEventListener('mouseleave', this._mouseleave);

	this.setStyle('cursor', 'pointer');

	this._player = true;

	return this;
}

Clip.prototype.disablePlayer = function() {
	if (!this.hasPlayer())
		return this;

	this.removeAttribute('tabindex');

	this.removeEventListener('click', this._click);

	this.removeEventListener('keydown', this._keydown);

	this.removeEventListener('mouseenter', this._mouseenter);

	this.removeEventListener('mouseleave', this._mouseleave);

	this.setStyle('cursor', 'default');

	this._player = false;

	return this;
}

Clip.prototype.setWidget = function(w) {
	View.prototype.setWidget.call(this, w);

	this._width = w.offsetWidth;
	this._height = w.offsetHeight;

	return this;
}

Clip.prototype.reset = function() {
	if (this._widget) {
		this._width = this._widget.width;
		this._height = this._widget.height;
	}

	return this;
}
