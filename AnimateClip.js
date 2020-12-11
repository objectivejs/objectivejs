/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function AnimateClip() {
	Clip.call(this);

	this._animlist = null;
	this._lastanim = null;
}

AnimateClip.prototype = Object.create(Clip.prototype);

Object.defineProperty(AnimateClip.prototype, 'constructor', { value: AnimateClip, enumerable: false, writable: true });

Object.defineProperty(AnimateClip.prototype, 'currentTime', {
	get:	function() {
		return this._animlist ? Math.floor(this._lastanim.currentTime) : 0;
	}
});

Object.defineProperty(AnimateClip.prototype, 'playbackRate', {
	get:	function() {
		return this._playbackRate;
	},
	set:	function(r) {
		if (typeof r !== 'number')
			throw new TypeError();

		if (r < Clip.minPlaybackRate || r > Clip.maxPlaybackRate)
			throw new RangeError();

		this._playbackRate = r;

		if (this._animlist)
			for (let e of this._animlist)
				e.playbackRate = r;
	}
});

AnimateClip.prototype.animate = function(animations, autoplay = false) {
	if (! (Array.isArray(animations) && animations.length > 0))
		throw new TypeError();

	if (this._animlist)
		for (let e of this._animlist)
			e.cancel();

	let duration = 0, lastanim;

	const animlist = [];

	for (let e of animations) {
		if (! (Array.isArray(e) && e.length == 3))
			throw new TypeError();

		let [widget, keyframes, options] = e;

		options.playbackRate = this._playbackRate;

		let anim = widget.animate(keyframes, options);

		let ms = (options.delay || 0) + options.duration * (options.iterations || 1) + (options.endDelay || 0);

		if (ms > duration) {
			lastanim = anim;
			duration = ms;
		}

		animlist.push(anim);
	}

	lastanim.onfinish = () => {
		this._ended = this._paused = true;

		this.notify('clipEnded', this);
	};

	this._duration = duration;

	this._animlist = animlist;
	this._lastanim = lastanim;

	if (!autoplay)
		for (let e of animlist)
			e.pause();

	this._paused = !autoplay;

	this._ended = false;

	return this;
};

AnimateClip.prototype.seek = function(ms) {
	if (!this._animlist)
		return this;

	for (let e of this._animlist) {
		e.currentTime = ms;
		if (this._paused)
			e.pause();
	}

	this.notify('clipSeeked', this);

	return this;
};

AnimateClip.prototype.play = function() {
	if (!this._animlist)
		return this;

	for (let e of this._animlist)
		if (this._ended || e.playState != 'finished')
			e.play();

	this._ended = this._paused = false;

	return this;
};

AnimateClip.prototype.pause = function() {
	if (!this._animlist)
		return this;

	for (let e of this._animlist)
		if (e.playState != 'finished')
			e.pause();

	this._paused = true;

	return this;
};
