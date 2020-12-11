/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function SelectionInspector(value, options = false) {
	options = options || {};

	let tags = options.tags;

	value = value || [];

	if (! (Array.isArray(value) && tags.every((e) => typeof e === 'string')))
		throw new TypeError();

	if (! (Array.isArray(tags) && tags.length > 0 && tags.every((e) => typeof e === 'string')))
		throw new TypeError();

	for (let tag of value) {
		if (tags.indexOf(tag) == -1)
			throw new RangeError();
	}

	Inspector.call(this);

	this._tags = tags;

	this._value = value;

	this._inputWidgets = null;
}

SelectionInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(SelectionInspector.prototype, 'constructor', { value: SelectionInspector, enumerable: false, writable: true });

SelectionInspector.prototype.validate = function(val) {
	return typeof val === 'string' && this._tags.indexOf(val) != -1;
};

SelectionInspector.prototype.reset = function() {
	if (!this._inputWidgets)
		return false;

	this._value = [];

	for (let tag in this._inputWidgets) {
		if (this._inputWidgets[tag].checked)
			this._value.push(tag);
	}

	return true;
};

SelectionInspector.prototype.changeCallback = function(e) {
	let val = e.target.value;

	if (this.validate(val)) {
		let i = this._value.indexOf(val);

		if (e.target.checked) {
			if (i == -1)
				this._value.push(val);
		}
		else {
			if (i != -1)
				this._value.splice(i, 1);
		}

		this.respondTo('inspectorValueChanged', this);
	}
};

SelectionInspector.prototype.resetWidget = function() {
	if (!this._inputWidgets)
		return false;

	for (let tag in this._inputWidgets)
		this._inputWidgets[tag].checked = this._value.indexOf(tag) != -1 ? true : false;

	return true;
};

SelectionInspector.prototype.setWidget = function(w) {
	Inspector.prototype.setWidget.call(this, w);

	this._inputWidgets  = {};

	for (let i of w.querySelectorAll('input[type="checkbox"]')) {
		let value = i.attributes.value;

		if (value !== undefined) {
			let tag = value.value;

			if (this._tags.indexOf(tag) != -1)
				this._inputWidgets[tag] = i;
		}
	}

	return this;
};
