/**
 *
 * @copyright  2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function AudioPlayer(options = false) {
	const audio = new Audio();

	if (! (audio.canPlayType('audio/ogg') || audio.canPlayType('audio/mpeg')) )
		throw new TypeError();

	this._audio = audio;

	options = options || {};

	let recorder = options.recorder ? true : false;

	let load = options.load ? true : false;
	let draganddrop = options.draganddrop ? true : false;

	let deleteURL = options.deleteURL;
	let uploadURL = options.uploadURL;

	if (! (typeof deleteURL === 'undefined' || deleteURL === null || typeof deleteURL === 'string'))
		throw new TypeError();

	if (! (typeof uploadURL === 'undefined' || uploadURL === null || typeof uploadURL === 'string'))
		throw new TypeError();

	if (! (recorder || load || draganddrop))
		uploadURL = null;

	if (uploadURL) {
		let chunksize = options.chunksize;

		if (chunksize === undefined)
			chunksize = 100000;
		else if (!Number.isInteger(chunksize))
			throw new TypeError();
		else if (chunksize < 10000)
			throw new RangeError();

		this._chunksize = chunksize;
	}

	View.call(this);

	if (recorder) {
		if (MediaRecorder.isTypeSupported('audio/ogg'))
			this._mediatype = 'audio/ogg';
		else if (MediaRecorder.isTypeSupported('audio/mpeg'))
			this._mediatype = 'audio/mpeg';
		else if (MediaRecorder.isTypeSupported('audio/webm'))
			this._mediatype = 'audio/webm';
		else
			this._mediatype = null;

		recorder = this._mediatype ? true : false;
	}

	this._recorder = recorder;
	this._mediarecorder = null;

	this._mediablob = null;

	this._load = load;
	this._draganddrop = draganddrop;

	this._deleteURL = deleteURL;
	this._uploadURL = uploadURL;

	this._playWidget = null;
	this._pauseWidget = null;
	this._barWidget = null;
	this._timeWidget = null;
	this._loopWidget = null;

	this._loadWidget = null;
	this._fileWidget = null;

	this._deleteWidget = null;
	this._uploadWidget = null;
	this._statusWidget = null;

	this._recordStartWidget = null;
	this._recordStopWidget = null;

	this._seeking = false;
	this._uploading = false;

	this._deletable = deleteURL ? true : false;
	this._uploadable = false;

	this._autoplay = false;

	this._error = null;
}

AudioPlayer.prototype = Object.create(View.prototype);

Object.defineProperty(AudioPlayer.prototype, 'constructor', { value: AudioPlayer, enumerable: false, writable: true });

Object.defineProperty(AudioPlayer.prototype, 'duration', {
	get:	function() {
				return this._audio.src ? Math.floor(this._audio.duration * 1000) : 0;
			}
});

Object.defineProperty(AudioPlayer.prototype, 'currentTime', {
	get:	function() {
				return this._audio.src ? Math.floor(this._audio.currentTime * 1000) : 0;
			},
	set:	function(ms) {
				if (this._recording || this._uploading)
					return;

				if (!this._audio.src)
					return;

				this._audio.currentTime = ms / 1000;
			}
});

Object.defineProperty(AudioPlayer.prototype, 'src', {
	get:	function() {
				return this._audio.src;
			},
	set:	function(url) {
				if (this._recording || this._uploading)
					return;

				this._autoplay = this.playing && url;

				if (this._audio.src)
					URL.revokeObjectURL(this._audio.src);

				if (url)
					this._audio.src = url;
				else {
					this._audio.removeAttribute('src');

					if (this._timeWidget)
						this._showDuration();
				}

				this._mediablob = null;

				this._uploadable = false;

				this._error = null;
			}
});

Object.defineProperty(AudioPlayer.prototype, 'loop', {
	get:	function() {
				return this._audio.loop;
			},
	set:	function(flag) {
				this._audio.loop = flag ? true : false;

				if (this._loopWidget) {
					if (this._audio.loop)
						this._loopWidget.classList.remove('off');
					else
						this._loopWidget.classList.add('off');
				}
			}
});

Object.defineProperty(AudioPlayer.prototype, 'playing', {
	get:	function() {
				return this._audio.src && !this._audio.paused;
			}
});

Object.defineProperty(AudioPlayer.prototype, 'recording', {
	get:	function() {
				return this._mediarecorder && this._mediarecorder.state !== 'inactive';
			}
});

AudioPlayer.prototype.setFromTracks = function(soundtracks) {
	let url = null;

	if (soundtracks) {
		if ('audio/wav' in soundtracks && this._audio.canPlayType('audio/wav')) {
			url = soundtracks['audio/wav'];
		}
		else if ('audio/ogg' in soundtracks && this._audio.canPlayType('audio/ogg')) {
			url = soundtracks['audio/ogg'];
		}
		else if ('audio/mpeg' in soundtracks && this._audio.canPlayType('audio/mpeg')) {
			url = soundtracks['audio/mpeg'];
		}
		else if ('audio/webm' in soundtracks && this._audio.canPlayType('audio/webm')) {
			url = soundtracks['audio/webm'];
		}
	}

	return this.src = url;
}

AudioPlayer.prototype.setFromAudio = function(w) {
	if (w.tagName != 'AUDIO')
		throw new TypeError();

	const soundtracks = [];

	for (let source of w.querySelectorAll('source'))
		soundtracks[source.getAttribute('type')] = source.getAttribute('src');

	return this.setFromTracks(soundtracks);
}

AudioPlayer.prototype.canPlayType = function(type) {
	return this._audio.canPlayType(type) ? true : false;
}

AudioPlayer.prototype.play = function() {
	if (!this._audio.src)
		return this;

	if (this._recording)
		return this;

	this._audio.play();

	return this;
}

AudioPlayer.prototype.pause = function() {
	if (!this._audio.src)
		return this;

	if (this._recording)
		return this;

	this._audio.pause();

	return this;
}

AudioPlayer.prototype.replay = function() {
	if (!this._audio.src)
		return this;

	if (this._recording)
		return this;

	this._audio.currentTime = 0;

	this._audio.play();

	return this;
}

AudioPlayer.prototype.resetWidget = function() {
	if (this._playWidget && this._pauseWidget) {
		if (!this._audio.src || this._recording) {
			this._playWidget.classList.add('disabled');
			this._pauseWidget.classList.add('disabled');
		}
		else {
			this._playWidget.classList.remove('disabled');
			this._pauseWidget.classList.remove('disabled');
		}
	}

	if (this._barWidget ) {
		if (!this._audio.src || this._recording)
			this._barWidget.disabled = true;
		else
			this._barWidget.disabled = false;
	}

	if (this._loopWidget ) {
		if (this._audio.loop)
			this._loopWidget.classList.remove('off');
		else
			this._loopWidget.classList.add('off');
	}

	if (this._uploadWidget) {
		if (this._uploadable && !this._uploading && !this._recording)
			this._uploadWidget.classList.remove('disabled');
		else
			this._uploadWidget.classList.add('disabled');

		if (this._error == 'upload')
			this._uploadWidget.classList.add('inerror');
		else
			this._uploadWidget.classList.remove('inerror');
	}

	if (this._deleteWidget) {
		if (this._deletable && !this._uploading)
			this._deleteWidget.classList.remove('disabled');
		else
			this._deleteWidget.classList.add('disabled');

		if (this._error == 'delete')
			this._deleteWidget.classList.add('inerror');
		else
			this._deleteWidget.classList.remove('inerror');
	}

	if (this._recordStartWidget && this._recordStopWidget) {
		if (!this._recorder || this._uploading) {
			this._recordStartWidget.classList.add('disabled');
			this._recordStopWidget.classList.add('disabled');
		}
		else {
			this._recordStartWidget.classList.remove('disabled');
			this._recordStopWidget.classList.remove('disabled');

			if (this._error == 'record')
				this._recordStartWidget.classList.add('inerror');
			else
				this._recordStartWidget.classList.remove('inerror');
		}
	}

	if (this._loadWidget) {
		if (this._recording || this._uploading)
			this._loadWidget.classList.add('disabled');
		else
			this._loadWidget.classList.remove('disabled');

		if (this._error == 'load')
			this._loadWidget.classList.add('inerror');
		else
			this._loadWidget.classList.remove('inerror');
	}

	return this;
}

AudioPlayer.prototype.setWidget = function(w) {
	View.prototype.setWidget.call(this, w);

	this._playWidget = w.querySelector('.audioplay');
	this._pauseWidget = w.querySelector('.audiopause');

	this._loopWidget = w.querySelector('.audioloop');

	this._timeWidget = w.querySelector('.audiotime');

	this._barWidget = w.querySelector('.audiobar');

	if (this._barWidget && this._barWidget.tagName != 'INPUT')
		this._barWidget = null;

	this._recordStartWidget = w.querySelector('.recordstart');
	this._recordStopWidget = w.querySelector('.recordstop');

	this._loadWidget = w.querySelector('.fileload');
	this._fileWidget = w.querySelector('.mediafile');

	if (this._fileWidget && this._fileWidget.tagName != 'INPUT')
		this._fileWidget = null;

	this._deleteWidget = w.querySelector('.audiodelete');
	this._uploadWidget = w.querySelector('.audioupload');

	this._statusWidget = w.querySelector('.mediastatus');

	const playing = this._audio.src && !this._audio.paused;
	const recording = this._mediarecorder && this._mediarecorder.state !== 'inactive';

	if (this._playWidget) {
		this._playWidget.hidden = playing ? true : false;

		this._playWidget.addEventListener('click', () => {
			if (!this._playWidget.classList.contains('disabled'))
				this.play();
		});
	}

	if (this._pauseWidget) {
		this._pauseWidget.hidden = playing ? false : true;

		this._pauseWidget.addEventListener('click', () => {
			if (!this._pauseWidget.classList.contains('disabled'))
				this.pause();
		});
	}

	if (this._loopWidget) {
		this._loopWidget.addEventListener('click', () => {
			if (!this._loopWidget.classList.contains('disabled'))
				this.loop = !this.loop;
		});
	}

	if (this._barWidget) {
		if (!playing) {
			this._barWidget.value = (this._audio.currentTime ? Math.floor(this._audio.currentTime / this._audio.duration * 100) : 0);
			this._showCurrentTime();
		}

		this._barWidget.addEventListener('mousedown', () => this._seeking = true);
		this._barWidget.addEventListener('mouseup', () => this._seeking = false);

		this._barWidget.addEventListener('change', () => {
			const duration = this._audio.src ? this._audio.duration : 0;

			if (duration) {
				let secs = this._barWidget.value / 100 * duration;

				secs = secs < this._audio.currentTime ? Math.floor(secs) : Math.ceil(secs);

				this._audio.currentTime = this._audio.loop && secs >= duration ? 0 : secs;
			}
		});
	}

	if (this._draganddrop) {
		w.addEventListener('drop', (e) => {
			const dt = e.dataTransfer;

			e.preventDefault();

			if (dt.types.indexOf('Files') != -1) {
				this._loadFile(dt.files[0]);
			}
		});

		w.addEventListener('dragenter', (e) => {
			const dt = e.dataTransfer;

			if (dt.types.indexOf('Files') != -1) {
				e.preventDefault();
			}
		});

		w.addEventListener('dragleave', (e) => {
			e.preventDefault();
		});

		w.addEventListener('dragover', (e) => {
			const dt = e.dataTransfer;

			e.preventDefault();

			dt.dropEffect = dt.types.indexOf('Files') != -1 && !(this._recording || this._uploading) ? 'copy' : 'none';
		});
	}

	if (this._fileWidget)
		this._fileWidget.hidden = true;

	if (this._loadWidget) {
		this._loadWidget.classList.add('disabled');

		if (this._fileWidget) {
			if (this._load) {
				this._loadWidget.addEventListener('click', () => {
					if (!this._loadWidget.classList.contains('disabled') && !(this._recording || this._uploading))
						this._fileWidget.click();
				});

				this._fileWidget.addEventListener('change', (e) => {
					if (e.target.value) {
						this._loadFile(e.target.files[0]);
					}
				});
			}
		}
		else
			this._loadWidget = null;
	}

	if (this._recordStartWidget) {
		this._recordStartWidget.classList.add('disabled');
		this._recordStartWidget.hidden = recording ? true : false;

		if (this._recorder) {
			this._recordStartWidget.addEventListener('click', () => {
				if (!this._recordStartWidget.classList.contains('disabled'))
					this.recordStart();
			});
		}
		else
			this._recordStartWidget = null;
	}

	if (this._recordStopWidget) {
		this._recordStopWidget.hidden = recording ? false : true;

		if (this._recorder) {
			this._recordStopWidget.addEventListener('click', () => {
				if (!this._recordStopWidget.classList.contains('disabled'))
					this.recordStop();
			});
		}
		else
			this._recordStopWidget = null;
	}

	if (this._uploadWidget) {
		this._uploadWidget.classList.add('disabled');

		if (this._uploadURL) {
			this._uploadWidget.addEventListener('click', () => {
				if (!this._uploadWidget.classList.contains('disabled'))
					this.uploadFile();
			});
		}
		else
			this._uploadWidget = null;
	}

	if (this._deleteWidget) {
		this._deleteWidget.classList.add('disabled');

		if (this._deleteURL) {
			this._deleteWidget.addEventListener('click', () => {
				if (!this._deleteWidget.classList.contains('disabled'))
					this.deleteFile();
			});
		}
		else
			this._deleteWidget = null;
	}

	this._audio.onloadedmetadata = () => {
		if (this.interfaced())
			this.resetWidget();

		this._showDuration();

		if (this._autoplay)
			this._audio.play();
	}

	this._audio.ontimeupdate = () => {
		if (this._barWidget && !this._seeking)
			this._barWidget.value = (this._audio.currentTime ? Math.floor(this._audio.currentTime / this._audio.duration * 100) : 0);

		this._showCurrentTime();
	};

	this._audio.onplay = () => {
		if (this._playWidget && this._pauseWidget) {
			this._playWidget.hidden = true;
			this._pauseWidget.hidden = false;
		}

		this.notify('audioPlayed', this);
	};

	this._audio.onpause = () => {
		if (this._playWidget && this._pauseWidget) {
			this._pauseWidget.hidden = true;
			this._playWidget.hidden = false;
		}

		this.notify('audioPaused', this);
	};

	this._audio.onended = () => {
		if (this._playWidget && this._pauseWidget) {
			this._pauseWidget.hidden = true;
			this._playWidget.hidden = false;
		}

		this.notify('audioEnded', this);
	};

	this._audio.onerror = () => {
		if (this._playWidget && this._pauseWidget) {
			this._pauseWidget.hidden = true;
			this._playWidget.hidden = false;
		}

		this._audio.removeAttribute('src');

		if (this.interfaced())
			this.resetWidget();

		this._showDuration();

		this.notify('audioError', this);
	}

	return this;
}

AudioPlayer.prototype.destroyWidget = function() {
	View.prototype.destroyWidget.call(this);

	this._playWidget = null;
	this._pauseWidget = null;
	this._barWidget = null;
	this._timeWidget = null;
	this._loopWidget = null;

	this._loadWidget = null;
	this._fileWidget = null;

	this._deleteWidget = null;
	this._uploadWidget = null;
	this._statusWidget = null;

	this._recordStartWidget = null;
	this._recordStopWidget = null;

	return this;
}

AudioPlayer.prototype.recordStart = function() {
	if (!this._recorder)
		return this;

	if (this._recording || this._uploading)
		return this;

	this._audio.pause();

	this._recording = true;

	this._error = null;

	if (this.interfaced())
		this.resetWidget();

	if (this._mediarecorder === null) {
		const options = {mimeType: this._mediatype, audioBitsPerSecond: 128000};

		navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
			this._mediarecorder = new MediaRecorder(stream, options);
			this._mediarecorder.ignoreMutedMedia = true;

			let recordedtime = 0;
			let mediachunks = [];

			this._mediarecorder.ondataavailable = (e) => {
				if (this._timeWidget)
					this._timeWidget.innerText = AudioPlayer._toHHMMSS(++recordedtime);

				mediachunks.push(e.data);
			};

			this._mediarecorder.onstart = () => {
				if (this._recordStartWidget && this._recordStopWidget) {
					this._recordStartWidget.hidden = true;
					this._recordStopWidget.hidden = false;
				}

				if (this._barWidget)
					this._barWidget.value = 0;

				if (this._timeWidget)
					this._timeWidget.innerText = AudioPlayer._toHHMMSS(recordedtime = 0);

				this.notify('audioRecordStarted', this);
			};

			this._mediarecorder.onstop = () => {
				if (this._recordStartWidget && this._recordStopWidget) {
					this._recordStartWidget.hidden = false;
					this._recordStopWidget.hidden = true;
				}

				const blob = new Blob(mediachunks.splice(0, mediachunks.length), {type: this._mediatype});

				if (this._audio.src)
					URL.revokeObjectURL(this._audio.src);

				this._audio.src = URL.createObjectURL(blob);

				this._mediablob = blob;

				this._recording = false;

				this._uploadable = true;

				if (this.interfaced())
					this.resetWidget();

				this.notify('audioRecordStopped', this);
			};

			this._mediarecorder.onerror = () => {
				if (this._recordStartWidget && this._recordStopWidget) {
					this._recordStartWidget.addClass('inerror');

					this._recordStartWidget.hidden = false;
					this._recordStopWidget.hidden = true;
				}

				this._recording = false;

				this._error = 'record';

				if (this.interfaced())
					this.resetWidget();

				this.notify('audioRecordError', this);
			};

			this._mediarecorder.start(1000);
		})
		.catch((err) => {
			this._recorder = false;

			this._recording = false;

			if (this.interfaced())
				this.resetWidget();
		});
	}
	else
		this._mediarecorder.start(1000);

	return this;
}

AudioPlayer.prototype.recordStop = function() {
	if (this._mediarecorder)
		this._mediarecorder.stop();

	return this;
}

AudioPlayer.prototype.uploadFile = function() {
	if (!this._uploadURL)
		return this;

	if (!this._mediablob)
		return this;

	if (this._recording || this._uploading)
		return this;

	const mediablob = this._mediablob;
	const uploadurl = this._uploadURL;
	const chunksize = this._chunksize;

	const filesize = mediablob.size;
	const filetype = mediablob.type;

	const filereader = new FileReader();

	filereader.onloadend = (e) => postdata(e.target.result);

	let offset = 0, progress = 0, blob;

	const uploadslice = () => {
		if (this._statusWidget && filesize > chunksize)
			this._statusWidget.innerText = `${progress}%`;

		blob = mediablob.slice(offset, offset + chunksize);
		filereader.readAsDataURL(blob);
	}

	const postdata = (data) => {
		$.post(uploadurl, {file_size: filesize, file_type: filetype, file_offset: offset, file_data: data})
			.done(() => {
				offset += blob.size;
				progress = Math.floor((offset / filesize) * 100);

				if (progress < 100)
					uploadslice();
				else {
					if (this._statusWidget)
						this._statusWidget.innerText = '';

					this._uploading = false;

					this._uploadable = false;
					this._deletable = true;

					this._error = null;

					if (this.interfaced())
						this.resetWidget();

					this.notify('audioUploaded', this);
				}
			})
			.fail(() => {
				if (this._statusWidget)
					this._statusWidget.innerText = '';

				if (this._uploadWidget)
					this._uploadWidget.classList.add('inerror');

				this._uploading = false;

				this._error = 'upload';

				if (this.interfaced())
					this.resetWidget();

				this.notify('audioError', this);
			});
	};

	this._uploading = true;

	if (this.interfaced())
		this.resetWidget();

	uploadslice();

	return this;
}

AudioPlayer.prototype.deleteFile = function() {
	if (!this._deleteURL)
		return this;

	if (this._uploading)
		return this;

	const deleteurl = this._deleteURL;

	const deletefile = () => {
		$.post(deleteurl)
			.done(() => {
				this._uploadable = this._mediablob ? true : false;
				this._deletable = false;

				this._error = null;

				if (this.interfaced())
					this.resetWidget();

				this.notify('audioDeleted', this);
			})
			.fail(() => {
				if (this._deleteWidget)
					this._deleteWidget.classList.add('inerror');

				this._error = 'delete';

				if (this.interfaced())
					this.resetWidget();

				this.notify('audioError', this);
			});
	};

	deletefile();

	return this;
}

AudioPlayer.prototype.loadAudio = function() {
	if (this._recording || this._uploading)
		return this;

	if (this._fileWidget)
		this._fileWidget.click();

	return this;
}

AudioPlayer.prototype._loadFile = function(fd) {
	if (!this._audio.canPlayType(fd.type)) {
		this._error = 'load';

		this.resetWidget();

		return;
	}

	this._autoplay = this.playing;

	if (this._audio.src)
		URL.revokeObjectURL(this._audio.src);

	this.src = URL.createObjectURL(fd);

	this._mediablob = fd;

	this._uploadable = true;

	this._error = null;

	this.resetWidget();

	this.notify('audioLoaded', this);
}

AudioPlayer.prototype._showDuration = function() {
	if (this._timeWidget)
		this._timeWidget.innerText = AudioPlayer._toHHMMSS(this._audio.src ? this._audio.duration : 0);
}

AudioPlayer.prototype._showCurrentTime = function() {
	if (this._timeWidget)
		this._timeWidget.innerText = AudioPlayer._toHHMMSS(this._audio.src ? this._audio.currentTime : 0);
}

AudioPlayer._toHHMMSS = function(nsecs) {
	nsecs = Math.floor(nsecs);

	let hh = Math.floor(nsecs / 3600);
    let mm = Math.floor((nsecs - (hh * 3600)) / 60);
    let ss = nsecs - (hh * 3600) - (mm * 60);

    hh = (hh < 10 ? '0' : '') + hh;
    mm = (mm < 10 ? '0' : '') + mm;
    ss = (ss < 10 ? '0' : '') + ss;

    return `${hh}:${mm}:${ss}`;
}
