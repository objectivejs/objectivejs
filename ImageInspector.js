/**
 *
 * @copyright  2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function ImageInspector(value = null, options = false) {
	options = options || {};

	let filetypes = options.filetypes;
	let maxsize = options.maxsize;

	let draganddrop = options.draganddrop === undefined ? true : (options.draganddrop ? true : false);
	let loadonclick = options.loadonclick === undefined ? true : (options.loadonclick ? true : false);

	if (!this.validate(value))
		throw new TypeError();

	if (filetypes === undefined)
		filetypes = ImageInspector.defaultFileTypes;
	else if (! (Array.isArray(filetypes) && filetypes.length > 0 && filetypes.every((e) => typeof e === 'string')))
		throw new TypeError();

	if (maxsize === undefined)
		maxsize = 0;
	else if (typeof maxsize !== 'number')
		throw new TypeError();
	else if (maxsize < 0)
		throw new RangeError();

	Inspector.call(this);

	if (value !== null) {
		const [data, width, height] = value;

		this._value = data;
		this._width = width;
		this._height = height;
	}

	this._type = undefined;
	this._size = 0;

	this._filetypes = filetypes;
	this._maxsize = maxsize;

	this._draganddrop = draganddrop;
	this._loadonclick = loadonclick;

	this._imageWidget = null;
	this._imageWidgetSrc = null;
}

ImageInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(ImageInspector.prototype, 'constructor', { value: ImageInspector, enumerable: false, writable: true });

ImageInspector.defaultFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

Object.defineProperty(ImageInspector.prototype, 'width', {
	get:	function() {
		return this._width;
	}
});

Object.defineProperty(ImageInspector.prototype, 'height', {
	get:	function() {
		return this._height;
	}
});

Object.defineProperty(ImageInspector.prototype, 'type', {
	get:	function() {
		if (!this._value)
			return undefined;

		if (this._type === undefined)
			this._type = /^data:(image\/[-.+0-9a-zA-Z]+);base64,/.exec(this._value)[1];

		return this._type;
	}
});

Object.defineProperty(ImageInspector.prototype, 'size', {
	get:	function() {
		if (!this._value)
			return 0;

		if (!this._size)
			this._size = atob(this._value.substring(this._value.indexOf(',')+1)).length;

		return this._size;
	}
});

ImageInspector.prototype.validate = function(val) {
	return val === null || (Array.isArray(val) && Validator.validateImageDataURL(val[0]) && Number.isInteger(val[1]) && Number.isInteger(val[2]) && val[1] >= 0 && val[2] >= 0);
};

ImageInspector.prototype.get = function() {
	return this._value ? [this._value, this._width, this._height] : null;
};

ImageInspector.prototype.set = function(val) {
	if (!this.validate(val))
		return false;

	const [data, width, height] = val === null ? [null, 0, 0] : val;

	if (this._value !== data) {
		this._value = data;

		this._width = width;
		this._height = height;
		this._type = undefined;
		this._size = 0;

		if (this.interfaced())
			this.resetWidget();
	}

	return true;
};

ImageInspector.prototype.loadImage = function() {
	if (this._widget)
		this._widget.click();

	return this;
};

ImageInspector.prototype.reset = function() {
	if (!this._widget)
		return false;

	if (!this._imageWidget.src)
		return false;

	this._loadurl(this._imageWidget.src);

	return true;
};

ImageInspector.prototype.disable = function() {
	Inspector.prototype.disable.call(this);

	if (this._imageWidget && this._loadonclick)
		this._imageWidget.style.cursor = 'default';

	return this;
};

ImageInspector.prototype.enable = function() {
	Inspector.prototype.enable.call(this);

	if (this._imageWidget && this._loadonclick)
		this._imageWidget.style.cursor = 'pointer';

	return this;
};

ImageInspector.prototype.changeCallback = function(e) {
	let val = e.target.value ? e.target.files[0] : false;

	if (val)
		this._loadblob(e.target.files[0]);
};

ImageInspector.prototype.resetWidget = function() {
	if (this._imageWidget) {
		this._imageWidget.src = this._value || this._imageWidgetSrc;

		this._imageWidget.setAttribute('title', this._value ? `${this._width}x${this._height}` : '');
	}

	return this;
};

ImageInspector.prototype.setWidget = function(w) {
	if (w.tagName != 'IMG')
		throw new TypeError();

	let input = document.createElement('input');

	input.type = 'file';
	input.accept = this._filetypes.join(',');

	input.style.display = 'none';

	Inspector.prototype.setWidget.call(this, input);

	if (this._loadonclick) {
		w.addEventListener('click', () => this.loadImage());
		w.style.cursor = this.isEnabled() ? 'pointer' : 'default';
	}

	if (this._draganddrop) {
		w.addEventListener('drop', (e) => {
			const dt = e.dataTransfer;

			e.preventDefault();

			if (dt.types.indexOf('Files') != -1) {
				this._loadblob(dt.files[0]);
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

			dt.dropEffect = dt.types.indexOf('Files') != -1 ? 'copy' : 'none';
		});
	}

	w.removeAttribute('width');
	w.removeAttribute('height');

	w.after(input);

	this._imageWidget = w;
	this._imageWidgetSrc = w.src;

	return this;
};

ImageInspector.prototype.manageWidget = function(parent = null) {
	Inspector.prototype.manageWidget.call(this, parent);

	if (this._parent && this._imageWidget)
		this._parent.appendChild(this._imageWidget);

	return this;
};

ImageInspector.prototype.unmanageWidget = function() {
	Inspector.prototype.unmanageWidget.call(this);

	if (this._parent && this._imageWidget)
		this._parent.removeChild(this._imageWidget);

	return this;
};

ImageInspector.prototype.createWidget = function() {
	const html = `<img src="${this._imageWidgetSrc}" alt="" title="" />`;

	let template = document.createElement('template');

	template.innerHTML = html;

	let widget = template.content.children[0];

	this.setWidget(widget);

	return this;
};

ImageInspector.prototype.destroyWidget = function() {
	Inspector.prototype.destroyWidget.call(this);

	this._imageWwidget = null;

	return this;
};

ImageInspector.prototype._loadurl = function(url) {
	const req = new XMLHttpRequest();

	req.open('GET', url);
	req.responseType = 'blob';
	req.setRequestHeader = this._filetypes.join(',');

	req.onload = () => this._loadblob(req.response);

	req.send();
};

ImageInspector.prototype._loadblob = function(blob) {
	if (this._maxsize > 0 && blob.size > this._maxsize)
		return;

	if (this._filetypes.indexOf(blob.type) == -1)
		return;

	const reader = new FileReader();

	reader.onload = (e) => {
		let data = e.target.result;

		if (this._value !== data) {
			this._value = data;
			this._width = this._height = 0;
			this._type = undefined;
			this._size = blob.size;

			if (this._imageWidget) {
				this._imageWidget.addEventListener('load', (e) => this._onloadsrc(e), { once: true });
				this._imageWidget.src = data;
			}
		}
	};

	reader.readAsDataURL(blob);
};

ImageInspector.prototype._onloadsrc = function(e) {
	const data = e.target.src;
	const r = /^data:(image\/[-.+0-9a-zA-Z]+);base64,/.exec(data);

	if (r) {
		const type = r[1];
		const svg = type == 'image/svg+xml';

		const w = svg ? e.target.width : e.target.naturalWidth;
		const h = svg ? e.target.height : e.target.naturalHeight;

		this._width = w;
		this._height = h;
		this._type = type;

		this._imageWidget.setAttribute('title', `${w}x${h}`);

		this.respondTo('inspectorValueChanged', this);
	}
	else
		this._imageWidget.setAttribute('title', '');
};
