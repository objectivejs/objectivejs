/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function RangeInspector(value = 0, options = false) {
	NumberInspector.call(this, value, options);

	options = options || {};

	let fixed = options.fixed;

	if (typeof fixed === 'undefined')
		fixed = false;
	else {
		if (!Number.isInteger(fixed))
			throw new TypeError();
		if (fixed < 0)
			throw new RangeError();
	}

	this._fixed = fixed;

	this._outputWidget = null;
}

RangeInspector.prototype = Object.create(NumberInspector.prototype);

Object.defineProperty(RangeInspector.prototype, 'constructor', { value: RangeInspector, enumerable: false, writable: true });

RangeInspector.prototype.resetWidget = function() {
	NumberInspector.prototype.resetWidget.call(this);

	if (this._outputWidget)
		this._outputWidget.value = this._fixed !== false ? this._value.toFixed(this._fixed) : this._value;

	return this;
}

RangeInspector.prototype.setWidget = function(w) {
	NumberInspector.prototype.setWidget.call(this, w);

	if (this._widget.id) {
		this._outputWidget = document.querySelector(`output[for="${this._widget.id}"]`);

		if (this._outputWidget)
			this._widget.onchange = () => this._outputWidget.value = this._fixed !== false ? this._value.toFixed(this._fixed) : this._value;
	}

	return this;
}
