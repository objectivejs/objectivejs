/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function OptionInspector(value, options = false) {
	options = options || {};

	let tags = options.tags;

	if (typeof value !== 'string')
		throw new TypeError();

	if (! (Array.isArray(tags) && tags.length > 0 && tags.every((e) => typeof e === 'string')))
		throw new TypeError();

	if (tags.indexOf(value) == -1)
		throw new RangeError();

	Inspector.call(this);

	this._tags = tags;

	this._value = value;

	this._inputWidgets = null;
}

OptionInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(OptionInspector.prototype, 'constructor', { value: OptionInspector, enumerable: false, writable: true });

OptionInspector.prototype.validate = function(val) {
	return typeof val === 'string' && this._tags.indexOf(val) != -1;
}

OptionInspector.prototype.reset = function() {
	if (!this._inputWidgets)
		return false;

	for (let tag in this._inputWidgets) {
		if (this._inputWidgets[tag].checked) {
			this._value = tag;
			break;
		}
	}

	return true;
}

OptionInspector.prototype.resetWidget = function() {
	if (this._inputWidgets) {
		let i = this._inputWidgets[this._value];

		if (i)
			i.checked = true;
	}

	return this;
}

OptionInspector.prototype.setWidget = function(w) {
	Inspector.prototype.setWidget.call(this, w);

	this._inputWidgets = {};

	for (let i of w.querySelectorAll('input[type="radio"]')) {
		let value = i.attributes.value;

		if (value !== undefined) {
			let tag = value.value;

			if (this._tags.indexOf(tag) != -1)
				this._inputWidgets[tag] = i;
		}
	}

	return this;
}
