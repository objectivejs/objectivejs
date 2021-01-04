/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    4
 * @link       http://www.objectivejs.org
 */

"use strict";

function VideoClip() {
	Clip.call(this);

	this._drawingarea = new DrawingArea();

	this._video = null;

	this._animlist = null;

	this._timeWidget = null;

	this._mutedWidget = null;

	this._onmute = null;

	this._streamvideo = null;
}

VideoClip.prototype = Object.create(Clip.prototype);

Object.defineProperty(VideoClip.prototype, 'constructor', { value: VideoClip, enumerable: false, writable: true });

Object.defineProperty(VideoClip.prototype, 'dimension', {
	get:	function() {
		return this._drawingarea.size;
	},
	set:	function(d) {
		this._drawingarea.size = d;
	}
});

Object.defineProperty(VideoClip.prototype, 'duration', {
	get:	function() {
		return this._video ? Math.floor(this._video.duration * 1000) : 0;
	}
});

Object.defineProperty(VideoClip.prototype, 'currentTime', {
	get:	function() {
		return this._video && this._video.currentTime > 0 ? Math.floor(this._video.currentTime * 1000) - 1 : 0;
	}
});

Object.defineProperty(VideoClip.prototype, 'playbackRate', {
	get:	function() {
		return this._playbackRate;
	},
	set:	function(r) {
		if (typeof r !== 'number')
			throw new TypeError();

		if (r < Clip.minPlaybackRate || r > Clip.maxPlaybackRate)
			throw new RangeError();

		this._playbackRate = r;

		if (this._video)
			this._video.playbackRate = r;

		if (this._animlist)
			for (let e of this._animlist)
				e.playbackRate = r;
	}
});

Object.defineProperty(VideoClip.prototype, 'muted', {
	get:	function() {
		return this._video ? this._video.muted : false;
	},
	set:	function(muted) {
		if (this._video) {
			this._video.muted = muted ? true : false;

			if (this._mutedWidget)
				this._mutedWidget.checked = this._video.muted;
		}
	}
});

Object.defineProperty(VideoClip.prototype, 'options', {
	get:	function() {
		return this._drawingarea.getOptions();
	},
	set:	function(options) {
		this._drawingarea.setOptions(options);
	}
});

VideoClip.prototype.get = function() {
	return this._drawingarea.getOptions();
};

VideoClip.prototype.set = function(options) {
	this._drawingarea.setOptions(options);

	return this;
};

VideoClip.prototype.setValue = function(prop, val) {
	if (prop == 'size')
		this._drawingarea.size = val;
	else if (prop == 'hflip')
		this._drawingarea.hflip = val;
	else if (prop == 'vflip')
		this._drawingarea.vflip = val;
	else if (prop == 'grayscale')
		this._drawingarea.grayscale = val;
	else if (prop == 'sepia')
		this._drawingarea.sepia = val;
	else if (prop == 'blur')
		this._drawingarea.blur = val;
	else if (prop == 'invert')
		this._drawingarea.invert = val;
	else if (prop == 'contrast')
		this._drawingarea.contrast = val;
	else if (prop == 'saturate')
		this._drawingarea.saturate = val;
	else if (prop == 'brightness')
		this._drawingarea.brightness = val;
	else if (prop == 'opacity')
		this._drawingarea.opacity = val;

	return this;
};

VideoClip.prototype.animate = function(animations) {
	if (! (Array.isArray(animations) && animations.length > 0))
		throw new TypeError();

	if (!this._widget)
		return this;

	if (this._animlist)
		for (let e of this._animlist)
			e.cancel();

	const animlist = [];

	for (let e of animations) {
		if (! (Array.isArray(e) && e.length == 2))
			throw new TypeError();

		let [keyframes, options] = e;

		let anim = this._widget.animate(keyframes, options);

		anim.pause();

		animlist.push(anim);
	}

	this._animlist = animlist;

	return this;
};

VideoClip.prototype.seek = function(ms) {
	if (!this._video)
		return this;

	this._video.currentTime = (ms + 1) / 1000;	// +1 for Chrome

	if (this._animlist) {
		for (let e of this._animlist) {
			e.currentTime = ms;
			if (this._paused)
				e.pause();
		}
	}

	return this;
};

VideoClip.prototype.play = function() {
	if (!this._video)
		return this;

	if (this._ended)
		this.seek(0);

	this._ended = this._paused = false;

	this._video.play();

	if (this._animlist) {
		for (let e of this._animlist)
			e.play();
	}

	return this;
};

VideoClip.prototype.pause = function() {
	if (!this._video)
		return this;

	this._paused = true;

	this._video.pause();

	if (this._animlist) {
		for (let e of this._animlist)
			e.pause();
	}

	return this;
};

VideoClip.prototype.setWidget = function(w) {
	if (w.tagName != 'VIDEO')
		throw new TypeError();

	this._drawingarea.setWidget(w);

	Clip.prototype.setWidget.call(this, this._drawingarea.widget);

	w.style.display = 'none';

	w.playbackRate = this._playbackRate;

	w.after(this._drawingarea.widget);

	this._video = w;

	w.onseeked = () => {
		this._drawingarea.setImage(this._video);

		if (this._timeWidget)
			this._timeWidget.innerText = VideoClip._toHHMMSS(this._video.currentTime);

		this.notify('clipSeeked', this);
	};

	w.onended = () => {
		this._ended = this._paused = true;

		if (this._animlist) {
			for (let e of this._animlist)
				e.pause();
		}

		this.notify('clipEnded', this);
	};

	w.load();

	return this;
};

VideoClip.prototype.addTimeWidget = function(w) {
	w.innerText = VideoClip._toHHMMSS(this._video.currentTime);

	this._timeWidget = w;

	return this;
};

VideoClip.prototype.removeTimeWidget = function() {
	this._timeWidget = null;

	return this;
};

VideoClip.prototype.addMutedWidget = function(w) {
	if (this._onmute)
		this.removeEventListener('change', this._onmute);

	this._onmute = () => this._video.muted = this._mutedWidget.checked;

	w.addEventListener('change', this._onmute);

	w.checked = this._video.muted;

	this._mutedWidget = w;

	return this;
};

VideoClip.prototype.removeMutedWidget = function() {
	if (this._onmute)
		this.removeEventListener('change', this._onmute);

	this._mutedWidget = null;

	return this;
};

VideoClip.prototype.enablePlayer = function() {
	if (this.hasPlayer())
		return this;

	Clip.prototype.enablePlayer.call(this);

	if (this._streamvideo === null) {
		this._streamvideo = () => {
			if (this._video.paused || this._video.ended)
				return;

			this._drawingarea.setImage(this._video);

			if (this._timeWidget)
				this._timeWidget.innerText = VideoClip._toHHMMSS(this._video.currentTime);

			requestAnimationFrame(this._streamvideo);
		};

		this._video.onplay = this._streamvideo;
	}

	return this;
};

VideoClip._toHHMMSS = function(nsecs) {
	nsecs = Math.floor(nsecs);

	let hh = Math.floor(nsecs / 3600);
	let mm = Math.floor((nsecs - (hh * 3600)) / 60);
	let ss = nsecs - (hh * 3600) - (mm * 60);

	hh = (hh < 10 ? '0' : '') + hh;
	mm = (mm < 10 ? '0' : '') + mm;
	ss = (ss < 10 ? '0' : '') + ss;

	return `${hh}:${mm}:${ss}`;
};
