/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function StringInspector(value = '', options = false) {
	options = options || {};

	let min = options.min;
	let max = options.max;

	let trim = options.trim === undefined || options.trim ? true : false;

	let escapeHTML = options.escapeHTML === undefined || options.escapeHTML ? true : false;

	let required = options.required ? true : false;

	if (typeof value !== 'string')
		throw new TypeError();

	if (! (typeof min === 'undefined' || typeof min === 'number'))
		throw new TypeError();

	if (! (typeof max === 'undefined' || typeof max === 'number'))
		throw new TypeError();

	if (typeof min === 'number' && typeof max === 'number' && min > max)
		throw new RangeError();

	if (typeof min === 'number' && value < min)
		throw new RangeError();

	if (typeof max === 'number' && value > max)
		throw new RangeError();

	if (trim)
		value = value.trim();

	if (escapeHTML)
		value = StringInspector._escapeHTML(value);

	if (this._min !== undefined && value.length < this._min)
		throw new RangeError();

	if (this._max !== undefined && value.length > this._max)
		throw new RangeError();

	Inspector.call(this);

	this._min = min;
	this._max = max;

	this._trim = trim;

	this._escapeHTML = escapeHTML;

	this._required = required;

	this._value = value;
}

StringInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(StringInspector.prototype, 'constructor', { value: StringInspector, enumerable: false, writable: true });

StringInspector.prototype.validate = function(val) {
	if (typeof val !== "string")
		return false;

	if (this._trim)
		val = val.trim();

	if (this._min !== undefined && val.length < this._min)
		return false;

	if (this._max !== undefined && val.length > this._max)
		return false;

	return true;
};

StringInspector.prototype.normalize = function(val) {
	if (this._trim)
		val = val.trim();

	if (this._escapeHTML)
		val = StringInspector._escapeHTML(val);

	return val;
};

StringInspector.prototype.setWidget = function(w) {
	Inspector.prototype.setWidget.call(this, w);

	if (this._min !== undefined)
		this._widget.minLength = this._min;

	if (this._max !== undefined)
		this._widget.maxLength = this._max;

	this._widget.required = this._required === true;

	return this;
};

StringInspector._escapeHTML = function(s) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;'
	};

	return s.replace(/[&<>]/g, function(c) { return map[c]; });
};
