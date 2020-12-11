/**
 *
 * @copyright  2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function Wall(options = false) {
	options = options || {};

	let draganddrop = options.draganddrop ? true : false;

	let tagsURL = options.tagsURL;

	let deleteURL = options.deleteURL;
	let uploadURL = options.uploadURL;

	let downloadURL = options.downloadURL;

	if (! (typeof tagsURL === 'undefined' || tagsURL === null || typeof tagsURL === 'string'))
		throw new TypeError();

	if (! (typeof deleteURL === 'undefined' || deleteURL === null || typeof deleteURL === 'string'))
		throw new TypeError();

	if (! (typeof uploadURL === 'undefined' || uploadURL === null || typeof uploadURL === 'string'))
		throw new TypeError();

	if (! (typeof downloadURL === 'undefined' || downloadURL === null || typeof downloadURL === 'string'))
		throw new TypeError();

	if (uploadURL) {
		let filetypes = options.filetypes;

		if (!Array.isArray(filetypes) && filetypes.length > 0 && filetypes.every((e) => typeof e === 'string'))
			throw new TypeError();

		this._filetypes = filetypes;

		let maxfiles = options.maxfiles;

		if (maxfiles === undefined)
			maxfiles = 10;
		else if (!Number.isInteger(maxfiles))
			throw new TypeError();
		else if (maxfiles < 1)
			throw new RangeError();

		this._maxfiles = maxfiles;

		let maxfilesize = options.maxfilesize;

		if (maxfilesize === undefined)
			maxfilesize = 1000000;
		else if (!Number.isInteger(maxfilesize))
			throw new TypeError();
		else if (maxfilesize < 100000)
			throw new RangeError();

		this._maxfilesize = maxfilesize;

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

	this._draganddrop = draganddrop;

	this._tagsURL = tagsURL;

	this._deleteURL = deleteURL;
	this._uploadURL = uploadURL;

	this._downloadURL = downloadURL;

	this._tagsWidget = null;

	this._deleteWidget = null;
	this._uploadWidget = null;
	this._downloadWidget = null;
	this._statusWidget = null;

	this._uploading = false;

	this._slots = {};

	this._tag = null;

	this._error = null;
}

Wall.prototype = Object.create(View.prototype);

Object.defineProperty(Wall.prototype, 'constructor', { value: Wall, enumerable: false, writable: true });

Object.defineProperty(Wall.prototype, 'files', {
	get:	function() {
		return Object.values(this._slots).map(e => e.file);
	},
	set:	function(filelist) {
		let slots = {};

		if (filelist) {
			for (let f of filelist) {
				const id = Number.parseInt(f.split('.')[0]);

				if (!Number.isInteger(id))
					throw new TypeError();

				if (id < 1)
					throw new RangeError();

				slots[id] = {file: f};
			}
		}

		this._slots = slots;

		if (this._tagsWidget)
			this.resetTagsWidget();
	}
});

Wall.prototype.resetTagsWidget = function() {
	const timestamp = Date.now();

	this._tagsWidget.innerHTML = '';

	for (let id in this._slots) {
		const img = document.createElement('img');

		img.src = `${this._tagsURL}/${id}.png?nocache=${timestamp}`;

		img.addEventListener('click', (e) => this._clickImage(e, id));

		this._slots[id].widget = img;

		this._tagsWidget.appendChild(img);
	}

	return this;
};

Wall.prototype.resetWidget = function() {
	if (this._uploadWidget) {
		if (!this._uploading)
			this._uploadWidget.classList.remove('disabled');
		else
			this._uploadWidget.classList.add('disabled');

		if (this._error == 'upload')
			this._uploadWidget.classList.add('inerror');
		else
			this._uploadWidget.classList.remove('inerror');
	}

	if (this._deleteWidget) {
		if (!this._uploading && this._tag)
			this._deleteWidget.classList.remove('disabled');
		else
			this._deleteWidget.classList.add('disabled');

		if (this._error == 'delete')
			this._deleteWidget.classList.add('inerror');
		else
			this._deleteWidget.classList.remove('inerror');
	}

	if (this._downloadWidget) {
		if (this._tag)
			this._downloadWidget.classList.remove('disabled');
		else
			this._downloadWidget.classList.add('disabled');
	}

	return this;
};

Wall.prototype.setWidget = function(w) {
	View.prototype.setWidget.call(this, w);

	this._tagsWidget = this._tagsURL ? w.querySelector('.tags') : false;

	this._fileWidget = this._uploadURL ? w.querySelector('.fileinput') : false;

	if (this._fileWidget && this._fileWidget.tagName != 'INPUT')
		this._fileWidget = null;

	this._uploadWidget = w.querySelector('.fileupload');
	this._deleteWidget = w.querySelector('.filedelete');
	this._downloadWidget = w.querySelector('.filedownload');
	this._statusWidget = w.querySelector('.filestatus');

	if (this._draganddrop && this._tagsWidget) {
		this._tagsWidget.addEventListener('drop', (e) => {
			const dt = e.dataTransfer;

			e.preventDefault();

			if (dt.types.indexOf('Files') != -1) {
				this._uploadFile(dt.files[0]);
			}
		});

		this._tagsWidget.addEventListener('dragenter', (e) => {
			const dt = e.dataTransfer;

			if (dt.types.indexOf('Files') != -1) {
				e.preventDefault();
			}
		});

		this._tagsWidget.addEventListener('dragleave', (e) => {
			e.preventDefault();
		});

		this._tagsWidget.addEventListener('dragover', (e) => {
			const dt = e.dataTransfer;

			e.preventDefault();

			dt.dropEffect = dt.types.indexOf('Files') != -1 && !this._uploading ? 'copy' : 'none';
		});
	}

	if (this._fileWidget)
		this._fileWidget.hidden = true;

	if (this._uploadWidget) {
		this._uploadWidget.classList.add('disabled');

		if (this._uploadURL && this._fileWidget) {
			this._uploadWidget.addEventListener('click', () => {
				if (!this._uploadWidget.classList.contains('disabled'))
					this._fileWidget.click();
			});

			this._fileWidget.addEventListener('change', (e) => {
				if (e.target.value) {
					this._uploadFile(e.target.files[0]);
				}
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

	if (this._downloadWidget) {
		this._downloadWidget.classList.add('disabled');

		if (this._downloadURL) {
			this._downloadWidget.addEventListener('click', () => {
				if (!this._downloadWidget.classList.contains('disabled'))
					this.downloadFile();
			});
		}
		else
			this._downloadWidget = null;
	}

	return this;
};

Wall.prototype.destroyWidget = function() {
	View.prototype.destroyWidget.call(this);

	if (this._tagsWidget) {
		for (let id in this._slots)
			delete this._slots[id].widget;
	}

	this._tagsWidget = null;

	this._deleteWidget = null;

	this._uploadWidget = null;
	this._fileWidget = null;

	this._downloadWidget = null;

	this._statusWidget = null;

	this._tag = null;

	return this;
};

Wall.prototype.uploadFile = function() {
	if (this._uploading)
		return this;

	if (this._fileWidget)
		this._fileWidget.click();

	return this;
};

Wall.prototype._uploadFile = function(fd) {
	if (!this._uploadURL)
		return this;

	const filesize = fd.size;
	const filetype = fd.type;

	if ((this._filetypes && this._filetypes.indexOf(filetype) == -1) || (this._filetypes && filesize > this._maxfilesize)) {
		this._error = 'upload';

		if (this.interfaced())
			this.resetWidget();

		return this;
	}

	let id;

	for (id = 1; id <= this._maxfiles; id++) {
		if (id in this._slots === false)
			break;
	}

	if (id > this._maxfiles) {
		this._error = 'upload';

		if (this.interfaced())
			this.resetWidget();

		return this;
	}

	const uploadurl = this._uploadURL;
	const chunksize = this._chunksize;

	const filereader = new FileReader();

	filereader.onloadend = (e) => postdata(e.target.result);

	let offset = 0, progress = 0, blob;

	const uploadslice = () => {
		if (this._statusWidget && filesize > chunksize)
			this._statusWidget.innerText = `${progress}%`;

		blob = fd.slice(offset, offset + chunksize);
		filereader.readAsDataURL(blob);
	};

	const postdata = (data) => {
		$.post(uploadurl, {file_id: id, file_size: filesize, file_type: filetype, file_offset: offset, file_data: data})
			.done(() => {
				offset += blob.size;
				progress = Math.floor((offset / filesize) * 100);

				if (progress < 100)
					uploadslice();
				else {
					if (this._statusWidget)
						this._statusWidget.innerText = '';

					let f;

					switch (filetype) {
						case 'image/jpeg':
							f = `${id}.jpg`;
							break;
						case 'image/png':
							f = `${id}.png`;
							break;
						case 'image/gif':
							f = `${id}.gif`;
							break;
						case 'application/pdf':
							f = `${id}.pdf`;
							break;
						default:
							f = `${id}`;
							break;
					}

					this._slots[id] = {file: f};

					if (this._tagsWidget) {
						const img = document.createElement('img');

						img.src = `${this._tagsURL}/${id}.png?nocache=${Date.now()}`;

						img.addEventListener('click', (e) => this._clickImage(e, id));

						this._slots[id].widget = img;

						this._tagsWidget.appendChild(img);
					}

					this._uploading = false;

					this._error = null;

					if (this.interfaced())
						this.resetWidget();
				}
			})
			.fail(() => {
				if (this._statusWidget)
					this._statusWidget.innerText = '';

				this._uploading = false;

				this._error = 'upload';

				if (this.interfaced())
					this.resetWidget();
			});
	};

	this._uploading = true;

	if (this.interfaced())
		this.resetWidget();

	uploadslice();

	return this;
};

Wall.prototype.deleteFile = function() {
	if (!this._deleteURL)
		return this;

	if (!this._tag)
		return this;

	if (this._uploading)
		return this;

	const deleteurl = this._deleteURL;

	const id = this._tag;

	const deletefile = () => {
		$.post(deleteurl, {file_id: id} )
			.done(() => {
				if (this._slots[id].widget)
					this._slots[id].widget.remove();

				delete this._slots[id];

				if (this._tag == id)
					this._tag = null;

				this._error = null;

				if (this.interfaced())
					this.resetWidget();
			})
			.fail(() => {
				this._error = 'delete';

				if (this.interfaced())
					this.resetWidget();
			});
	};

	deletefile();

	return this;
};

Wall.prototype.downloadFile = function() {
	if (!this._downloadURL)
		return this;

	if (!this._tag)
		return this;

	window.open(`${this._downloadURL}/${this._slots[this._tag].file}`);

	return this;
};

Wall.prototype.selectTag = function(id) {
	if (this._tag === id)
		return this;

	const newtag = this._slots[id];

	if (newtag === undefined)
		return this;

	if (this._tag) {
		const oldtag = this._slots[this._tag];

		if (oldtag.widget)
			oldtag.widget.classList.remove('selected');
	}

	if (newtag.widget)
		newtag.widget.classList.add('selected');

	this._tag = id;

	if (this.interfaced())
		this.resetWidget();

	return this;
};

Wall.prototype.unselectTag = function() {
	if (!this._tag)
		return this;

	const tag = this._slots[this._tag];

	if (tag.widget)
		tag.widget.classList.remove('selected');

	this._tag = null;

	if (this.interfaced())
		this.resetWidget();

	return this;
};

Wall.prototype._clickImage = function(e, id) {
	if (e.shiftKey) {
		if (!this._downloadURL)
			return;

		window.open(`${this._downloadURL}/${this._slots[id].file}`);
	}
	else {
		if (this._tag == id)
			this.unselectTag();
		else
			this.selectTag(id);
	}
};
