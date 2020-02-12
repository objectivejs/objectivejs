/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function DimensionInspector(width = 0, height = 0, options = false) {
	if (!Number.isInteger(width))
		throw new TypeError();

	if (!Number.isInteger(height))
		throw new TypeError();

	options = options || {};

	let ratio =	this.validateOptions(width, height, options);

	let minWidth = options.minWidth;
	let maxWidth = options.maxWidth;
	let minHeight = options.minHeight;
	let maxHeight = options.maxHeight;

	if (width < minWidth || (maxWidth !== 'undefined' && width > maxWidth))
		throw new RangeError();

	if (height < minHeight || (maxHeight !== 'undefined' && height > maxHeight))
		throw new RangeError();

	Inspector.call(this);

	const widthInspector = new NumberInspector(width, {min: minWidth, max: maxWidth})
	const heightInspector = new NumberInspector(height, {min: minHeight, max: maxHeight});

	this._widthInspector = widthInspector.addNextResponder(this);
	this._heightInspector = heightInspector.addNextResponder(this);

	this._ratio = ratio;
}

DimensionInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(DimensionInspector.prototype, 'constructor', { value: DimensionInspector, enumerable: false, writable: true });

Object.defineProperty(DimensionInspector.prototype, 'ratio', {
	get:	function() {
				return this._ratio;
			}
});

Object.defineProperty(DimensionInspector.prototype, 'minWidth', {
	get:	function() {
				return this._widthInspector.min;
			}
});

Object.defineProperty(DimensionInspector.prototype, 'maxWidth', {
	get:	function() {
				return this._widthInspector.max;
			}
});

Object.defineProperty(DimensionInspector.prototype, 'minHeight', {
	get:	function() {
				return this._heightInspector.min;
			}
});

Object.defineProperty(DimensionInspector.prototype, 'maxHeight', {
	get:	function() {
				return this._heightInspector.max;
			}
});

DimensionInspector.prototype.validate = function(val) {
	return Array.isArray(val) && val.length == 2 && this._widthInspector.validate(val[0]) && this._heightInspector.validate(val[1]);
}

DimensionInspector.prototype.get = function() {
	return [this._widthInspector.get(), this._heightInspector.get()];
}

DimensionInspector.prototype.set = function(val) {
	if (!this.validate(val))
		return false;

	const [width, height] = val;

	if (this._ratio != DimensionInspector._computeRatio(width, height))
		return false;

	if (this._minWidth !== 'undefined' && width < this._minWidth)
		return false;

	if (this._maxWidth !== 'undefined' && width > this._maxWidth)
		return false;

	if (this._minHeight !== 'undefined' && height < this._minHeight)
		return false;

	if (this._maxHeight !== 'undefined' && height > this._maxHeight)
		return false;

	this._widthInspector.set(width);
	this._heightInspector.set(height);

	if (this.interfaced())
		this.resetWidget();

	return true;
}

DimensionInspector.prototype.setOptions = function(width, height, options) {
	options = options || {};

	let ratio = this.validateOptions(width, height, options);

	this._widthInspector.min = options.minWidth;
	this._widthInspector.max = options.maxWidth;
	this._heightInspector.min = options.minHeight;
	this._heightInspector.max = options.maxHeight;

	if (this._ratio !== ratio) {
		this._ratio = ratio;

		if (ratio !== 0) {
			if (width >= height)
				this.adjustHeight();
			else
				this.adjustWidth();
		}
	}

 	return this;
}

DimensionInspector.prototype.validateOptions = function(width, height, options) {
	let ratio = DimensionInspector._computeRatio(width, height);

	let minWidth = options.minWidth;
	let maxWidth = options.maxWidth;
	let minHeight = options.minHeight;
	let maxHeight = options.maxHeight;

	if (typeof minWidth === 'undefined')
		minWidth = 0;
	else if (!Number.isInteger(minWidth))
		throw new TypeError();

	if (typeof minHeight === 'undefined')
		minHeight = 0;
	else if (!Number.isInteger(minHeight))
		throw new TypeError();

	if (! (typeof maxWidth === 'undefined' || Number.isInteger(maxWidth)))
		throw new TypeError();

	if (! (typeof maxHeight === 'undefined' || Number.isInteger(maxHeight)))
		throw new TypeError();

	if (maxWidth !== 'undefined' && minWidth > maxWidth)
		throw new RangeError();

	if (maxHeight !== 'undefined' && minHeight > maxHeight)
		throw new RangeError();

	if (ratio) {
		if (maxWidth && maxHeight) {
			if (ratio != DimensionInspector._computeRatio(maxWidth, maxHeight))
				throw new RangeError();
		}
		else if (maxWidth)
			maxHeight = maxWidth / ratio;
		else if (maxHeight)
			maxWidth = maxHeight * ratio;

		if (minWidth && minHeight) {
			if (ratio != DimensionInspector._computeRatio(minWidth, minHeight))
				throw new RangeError();
		}
		else if (minWidth)
			minHeight = minWidth / ratio;
		else if (minHeight)
			minWidth = minHeight * ratio;
	}

	options.minWidth = minWidth;
	options.maxWidth = maxWidth;
	options.minHeight = minHeight;
	options.maxHeight = maxHeight;

	return ratio;
}

DimensionInspector.prototype.adjustWidth = function() {
	if (this._ratio)
		this._widthInspector.set(2 * Math.round(this._heightInspector.get() * this._ratio / 2));
}

DimensionInspector.prototype.adjustHeight = function() {
	if (this._ratio)
		this._heightInspector.set(2 * Math.round(this._widthInspector.get() / this._ratio / 2));
}

DimensionInspector.prototype.inspectorValueChanged = function(sender) {
	if (sender === this._widthInspector)
		this.adjustHeight();
	else if (sender === this._heightInspector)
		this.adjustWidth();

	this.nextRespondTo('inspectorValueChanged', this);

	return true;
}

DimensionInspector.prototype.resetWidget = function(val) {
	this._widthInspector.resetWidget();
	this._heightInspector.resetWidget();

	return true;
}

DimensionInspector.prototype.setWidget = function(w) {
	let wlist = w.querySelectorAll('input[type=number]');

	if (wlist.length != 2)
		throw new TypeError();

	this._widthInspector.setWidget(wlist[0]);
	this._heightInspector.setWidget(wlist[1]);

	View.prototype.setWidget.call(this, w);

	return this;
}

DimensionInspector._computeRatio = (w, h) => w !== 0 && h !== 0 ? Math.round(w / h * 100) / 100 : 0;
