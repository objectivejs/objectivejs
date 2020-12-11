/**
 *
 * @copyright  2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function AudioPlaylist(player, tracks) {
	View.call(this);

	player.addListener(this);

	this._player = player;

	this._tracks = tracks;

	this._currentTrack = 1;

	this._gap = 0;

	this._timer = null;
}

AudioPlaylist.prototype = Object.create(View.prototype);

Object.defineProperty(AudioPlaylist.prototype, 'constructor', { value: AudioPlaylist, enumerable: false, writable: true });

Object.defineProperty(AudioPlaylist.prototype, 'currentTrack', {
	get:	function() {
		return this._currentTrack;
	},
	set:	function(n) {
		if (!Number.isInteger(n))
			throw new TypeError();

		if (n < 1 || n > this._tracks.length)
			n = this._tracks.length;

		if (this._tracks[this._currentTrack-1].widget)
			this._tracks[this._currentTrack-1].widget.classList.remove('selected');

		this._currentTrack = n;

		if (this._tracks[this._currentTrack-1].widget)
			this._tracks[this._currentTrack-1].widget.classList.add('selected');

		this._player.src = this._tracks[n-1].url;
	}
});

Object.defineProperty(AudioPlaylist.prototype, 'gap', {
	get:	function() {
		return this._gap;
	},
	set:	function(ms) {
		if (!Number.isInteger(ms))
			throw new TypeError();

		if (ms < 0)
			throw new RangeError();

		this._gap = ms;
	}
});

AudioPlaylist.prototype.audioEnded = function(sender) {
	if (this._currentTrack == this._tracks.length)
		this.currentTrack = 1;
	else {
		this.nextTrack();

		if (this._gap > 0)
			this._timer = setTimeout(() => { this._timer = null; this._player.play(); }, this._gap);
		else
			this._player.play();
	}
};

AudioPlaylist.prototype.audioPlayed = function(sender) {
	if (this._timer) {
		clearTimeout(this._timer);
		this._timer = null;
	}
};

AudioPlaylist.prototype.nextTrack = function() {
	return this.currentTrack = this._currentTrack == this._tracks.length ? 1 : this._currentTrack + 1;
};

AudioPlaylist.prototype.previousTrack = function() {
	return this.currentTrack = this._currentTrack == 1 ? this._tracks.length : this._currentTrack - 1;
};

AudioPlaylist.prototype.setWidget = function(w) {
	if (! (w.tagName == 'OL' || w.tagName == 'UL'))
		throw new TypeError();

	w.querySelectorAll('li > span').forEach((e, i) => {
		this._tracks[i].widget = e;
		e.onclick = () => this.currentTrack = i + 1;
	});

	View.prototype.setWidget.call(this, w);

	return this;
};

AudioPlaylist.prototype.createWidget = function() {
	const playlist = [];

	for (let trackdata of this._tracks)
		playlist.push(`<li><span>${trackdata.title}</span></li>`);

	const html = '<ol class="ojs_playlist">' + '\n' + playlist.join('\n') + '\n' + '</ol>';

	let template = document.createElement('template');

	template.innerHTML = html;

	let widget = template.content.children[0];

	this.setWidget(widget);

	return this;
};

AudioPlaylist.prototype.destroyWidget = function() {
	View.prototype.destroyWidget.call(this);

	for (let trackdata of this._tracks)
		delete trackdata.widget;

	return this;
};
