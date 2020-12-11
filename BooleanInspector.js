/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function BooleanInspector(value = false) {
	Inspector.call(this);

	this._value = value ? true : false;
}

BooleanInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(BooleanInspector.prototype, 'constructor', { value: BooleanInspector, enumerable: false, writable: true });

BooleanInspector.prototype.normalize = function(val) {
	return val ? true : false;
};

BooleanInspector.prototype.reset = function() {
	if (!this._widget)
		return false;

	this._value = this._widget.checked;

	return true;
};

BooleanInspector.prototype.changeCallback = function(e) {
	let val = e.target.checked;

	if (this._value !== val) {
		this._value = val;

		this.respondTo('inspectorValueChanged', this);
	}
};

BooleanInspector.prototype.resetWidget = function() {
	if (this._widget)
		this._widget.checked = this._value;

	return this;
};
