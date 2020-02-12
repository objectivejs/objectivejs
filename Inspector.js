/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function Inspector() {
	View.call(this);
}

Inspector.prototype = Object.create(View.prototype);

Object.defineProperty(Inspector.prototype, 'constructor', { value: Inspector, enumerable: false, writable: true });

Inspector.prototype.validate = function(val) {
	return true;
}

Inspector.prototype.normalize = function(val) {
	return val;
}

Inspector.prototype.get = function() {
	return this._value;
}

Inspector.prototype.set = function(val) {
	if (!this.validate(val))
		return false;

	val = this.normalize(val);

	if (this._value !== val) {
		this._value = val;

		if (this.interfaced())
			this.resetWidget();
	}

	return true;
}

Inspector.prototype.reset = function() {
	if (!this._widget)
		return false;

	let val = this._widget.value;

	if (!this.validate(val))
		return false;

	this._value = this.normalize(val);

	return true;
}

Inspector.prototype.changeCallback = function(e) {
	let val = e.target.value;

	if (this.validate(val)) {
		val = this.normalize(val);

		if (this._value !== val) {
			this._value = val;

			this.respondTo('inspectorValueChanged', this);
		}
	}
}

Inspector.prototype.resetWidget = function() {
	if (this._widget)
		this._widget.value = this._value;

	return this;
}

Inspector.prototype.setWidget = function(w) {
	w.addEventListener('change', (e) => this.changeCallback(e));

	View.prototype.setWidget.call(this, w);

	return this;
}
