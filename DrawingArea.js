/**
 *
 * @copyright  2020-2021 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function DrawingArea() {
	View.call(this);

	this._width = this._height = 0;

	this._hflip = this._vflip = false;

	this._grayscale = this._sepia = this._blur = false;

	this._contrast = this._saturate = this._brightness = 1;

	this._invert = 0;

	this._opacity = 1;

	this._ctx = null;

	this._image = null;
}

DrawingArea.prototype = Object.create(View.prototype);

Object.defineProperty(DrawingArea.prototype, 'constructor', { value: DrawingArea, enumerable: false, writable: true });

Object.defineProperty(DrawingArea.prototype, 'size', {
	get:	function() {
		return [this._width, this._height];
	},
	set:	function(size) {
		if (! (Array.isArray(size) && size.length == 2))
			throw new TypeError();

		const [width, height] = size;

		if (! (Number.isInteger(width) && Number.isInteger(height)))
			throw new TypeError();

		if (width < 0 || height < 0)
			throw new RangeError();

		if (this._width != width || this._height != height) {
			this._width = width;
			this._height = height;

			if (this.interfaced()) {
				this._ctxTransform();
				this._drawImage();
			}
		}
	}
});

Object.defineProperty(DrawingArea.prototype, 'hflip', {
	get:	function() {
		return this._hflip;
	},
	set:	function(hflip) {
		if (this._hflip != hflip) {
			this._hflip = hflip ? true : false;

			if (this.interfaced()) {
				this._ctxTransform();
				this._drawImage();
			}
		}
	}
});

Object.defineProperty(DrawingArea.prototype, 'vflip', {
	get:	function() {
		return this._vflip;
	},
	set:	function(vflip) {
		if (this._vflip != vflip) {
			this._vflip = vflip ? true : false;

			if (this.interfaced()) {
				this._ctxTransform();
				this._drawImage();
			}
		}
	}
});

Object.defineProperty(DrawingArea.prototype, 'grayscale', {
	get:	function() {
		return this._grayscale;
	},
	set:	function(grayscale) {
		if (this._grayscale != grayscale) {
			this._grayscale = grayscale ? true : false;

			if (this.interfaced()) {
				this._ctxFilter();
				this._drawImage();
			}
		}
	}
});

Object.defineProperty(DrawingArea.prototype, 'sepia', {
	get:	function() {
		return this._sepia;
	},
	set:	function(sepia) {
		if (this._sepia != sepia) {
			this._sepia = sepia ? true : false;

			if (this.interfaced()) {
				this._ctxFilter();
				this._drawImage();
			}
		}
	}
});

Object.defineProperty(DrawingArea.prototype, 'blur', {
	get:	function() {
		return this._blur;
	},
	set:	function(blur) {
		if (this._blur != blur) {
			this._blur = blur ? true : false;

			if (this.interfaced()) {
				this._ctxFilter();
				this._drawImage();
			}
		}
	}
});

Object.defineProperty(DrawingArea.prototype, 'invert', {
	get:	function() {
		return this._invert;
	},
	set:	function(invert) {
		if (typeof invert !== 'number')
			throw new TypeError();

		if (invert < 0 || invert > 1)
			throw new RangeError();

		if (this._invert != invert) {
			this._invert = invert;

			if (this.interfaced()) {
				this._ctxFilter();
				this._drawImage();
			}
		}
	}
});

Object.defineProperty(DrawingArea.prototype, 'contrast', {
	get:	function() {
		return this._contrast;
	},
	set:	function(contrast) {
		if (typeof contrast !== 'number')
			throw new TypeError();

		if (contrast < 0)
			throw new RangeError();

		if (this._contrast != contrast) {
			this._contrast = contrast;

			if (this.interfaced()) {
				this._ctxFilter();
				this._drawImage();
			}
		}
	}
});

Object.defineProperty(DrawingArea.prototype, 'saturate', {
	get:	function() {
		return this._saturate;
	},
	set:	function(saturate) {
		if (typeof saturate !== 'number')
			throw new TypeError();

		if (saturate < 0)
			throw new RangeError();

		if (this._saturate != saturate) {
			this._saturate = saturate;

			if (this.interfaced()) {
				this._ctxFilter();
				this._drawImage();
			}
		}
	}
});

Object.defineProperty(DrawingArea.prototype, 'brightness', {
	get:	function() {
		return this._brightness;
	},
	set:	function(brightness) {
		if (typeof brightness !== 'number')
			throw new TypeError();

		if (brightness < 0)
			throw new RangeError();

		if (this._brightness != brightness) {
			this._brightness = brightness;

			if (this.interfaced()) {
				this._ctxFilter();
				this._drawImage();
			}
		}
	}
});

Object.defineProperty(DrawingArea.prototype, 'opacity', {
	get:	function() {
		return this._opacity;
	},
	set:	function(opacity) {
		if (typeof opacity !== 'number')
			throw new TypeError();

		if (opacity < 0 || opacity > 1)
			throw new RangeError();

		if (this._opacity != opacity) {
			this._opacity = opacity;

			if (this.interfaced()) {
				this._ctxFilter();
				this._drawImage();
			}
		}
	}
});

DrawingArea.prototype.getOptions = function() {
	const options = {
		size:	[this._width, this._height],
		hflip:		this._hflip,
		vflip:		this._vflip,
		grayscale:	this._grayscale,
		sepia:		this._sepia,
		blur:		this._blur,
		invert:		this._invert,
		contrast:	this._contrast,
		saturate:	this._saturate,
		brightness:	this._brightness,
		opacity:	this._opacity
	};

	return options;
};

DrawingArea.prototype.setOptions = function(options) {
	const {
		size = [this._width, this._height],
		hflip = this._hflip,
		vflip = this._vflip,
		grayscale = this._grayscale,
		sepia = this._sepia,
		blur = this._blur,
		invert = this._invert,
		contrast = this._contrast,
		saturate = this._saturate,
		brightness = this._brightness,
		opacity = this._opacity
	} = options || {};

	if (! (Array.isArray(size) && size.length == 2))
		throw new TypeError();

	const [width, height] = size;

	if (! (Number.isInteger(width) && Number.isInteger(height)))
		throw new TypeError();

	if (width < 0 || height < 0)
		throw new RangeError();

	this._width = width;
	this._height = height;

	this._hflip = hflip ? true : false;
	this._vflip = vflip ? true : false;
	this._grayscale = grayscale ? true : false;
	this._sepia = sepia ? true : false;
	this._blur = blur ? true : false;

	if (! (typeof invert === 'number' && typeof contrast === 'number' && typeof saturate === 'number' && typeof brightness === 'number' && typeof opacity === 'number'))
		throw new TypeError();

	if (invert < 0 || contrast < 0 || saturate < 0 || brightness < 0)
		throw new RangeError();

	if (opacity < 0 || opacity > 1)
		throw new RangeError();

	this._invert = invert;
	this._contrast = contrast;
	this._saturate = saturate;
	this._brightness = brightness;

	this._opacity = opacity;

	if (this.interfaced()) {
		this._ctxTransform();
		this._drawImage();
	}

	return this;
};

DrawingArea.prototype.erase = function() {
	if (this._widget && this._widget.width != 0 && this._widget.height != 0) {
		this._ctx.clearRect(0, 0, this._widget.width, this._widget.height);
	}

	return this;
};

DrawingArea.prototype.isBlank = function() {
	if (!this._widget || this._widget.width == 0 || this._widget.height == 0)
		return true;

	const imgdata = this._ctx.getImageData(0, 0, this._widget.width, this._widget.height);

	return imgdata ? !new Uint32Array(imgdata.data.buffer).some(color => color != 0) : true;
};

DrawingArea.prototype.setImage = function(w) {
	this._image = w;

	this._drawImage();

	return this;
};

DrawingArea.prototype.setWidget = function(w) {
	if (! (w.tagName == 'IMG' || w.tagName == 'VIDEO' || w.tagName == 'CANVAS'))
		throw new TypeError();

	const canvas = document.createElement('canvas');

	this._ctx = canvas.getContext('2d');

	View.prototype.setWidget.call(this, canvas);

	w.style.display = 'none';

	w.after(canvas);

	this._image = w;

	if (this._width == 0) {
		this._width = w.width;
		this._height = w.height;
	}

	this._ctxTransform();

	switch (w.tagName) {
		case 'IMG':
			this._drawImage();	// NEEDED for Chrome
			w.addEventListener('load', () => this._drawImage(), { once: true });
			break;
		case 'VIDEO':
			w.addEventListener('loadeddata', () => this._drawImage(), { once: true });
			break;
		case 'CANVAS':
		default:
			this._drawImage();
	}

	return this;
};

DrawingArea.prototype._ctxFilter = function() {
	let filter = [];

	if (this._grayscale)
		filter.push('grayscale(1)');

	if (this._sepia)
		filter.push('sepia(1)');

	if (this._blur)
		filter.push('blur(8px)');

	if (this._invert != 0)
		filter.push(`invert(${this._invert})`);

	if (this._contrast != 1)
		filter.push(`contrast(${this._contrast})`);

	if (this._saturate != 1)
		filter.push(`saturate(${this._saturate})`);

	if (this._brightness != 1)
		filter.push(`brightness(${this._brightness})`);

	if (this._opacity != 1)
		filter.push(`opacity(${this._opacity})`);

	this._ctx.filter = filter.length ? filter.join(' ') : 'none';
};

DrawingArea.prototype._ctxTransform = function() {
	this._widget.width = this._width;
	this._widget.height = this._height;

	this._ctx.transform(this._hflip ? -1 : 1, 0, 0, this._vflip ? -1 : 1, this._hflip ? this._widget.width : 0, this._vflip ? this._widget.height : 0);

	this._ctxFilter();
};

DrawingArea.prototype._drawImage = function() {
	if (this._widget.width == 0 || this._widget.height == 0)
		return;

	this._ctx.clearRect(0, 0, this._widget.width, this._widget.height);

	let steps = Math.ceil(Math.log(Math.max(this._image.width / this._widget.width, this._image.height / this._widget.height)) / Math.log(2));

	if (steps > 1) {
		const oc = document.createElement('canvas');
		const octx = oc.getContext('2d');

		let ocw = this._image.width * 0.5, och = this._image.height * 0.5;

		oc.width = ocw;
		oc.height = och;

		octx.drawImage(this._image, 0, 0, ocw, och);

		while (--steps > 1)
			octx.drawImage(oc, 0, 0, ocw, och, 0, 0, ocw *= 0.5, och *= 0.5);

		this._ctx.drawImage(oc, 0, 0, ocw, och, 0, 0, this._widget.width, this._widget.height);
	}
	else
		this._ctx.drawImage(this._image, 0, 0, this._widget.width, this._widget.height);
};
