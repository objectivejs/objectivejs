/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function NumberInspector(value = 0, options = false) {
	options = options || {};

	let min = options.min;
	let max = options.max;

	if (typeof value !== 'number')
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

	Inspector.call(this);

	this._min = min;
	this._max = max;

	this._value = value;
}

NumberInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(NumberInspector.prototype, 'constructor', { value: NumberInspector, enumerable: false, writable: true });

Object.defineProperty(NumberInspector.prototype, 'min', {
	get:	function() {
		return this._min;
	},
	set:	function(min) {
		if (! (typeof min === 'undefined' || typeof min === 'number'))
			throw new TypeError();

		if (this._min !== min) {
			this._min = min;

			if (min !== undefined && this._value < min) {
				this._value = min;

				if (this.interfaced)
					this.resetWidget();
			}
		}
	}
});

Object.defineProperty(NumberInspector.prototype, 'max', {
	get:	function() {
		return this._max;
	},
	set:	function(max) {
		if (! (typeof max === 'undefined' || typeof max === 'number'))
			throw new TypeError();

		if (this._max !== max) {
			this._max = max;

			if (max !== undefined && this._value > max) {
				this._value = max;

				if (this.interfaced)
					this.resetWidget();
			}
		}
	}
});

NumberInspector.prototype.validate = function(val) {
	return typeof val === 'number';
};

NumberInspector.prototype.normalize = function(val) {
	if (this._min !== undefined && val < this._min)
		return this._min;

	if (this._max !== undefined && val > this._max)
		return this._max;

	return val;
};

NumberInspector.prototype.changeCallback = function(e) {
	let val = Number.parseFloat(e.target.value.trim());

	if (this.validate(val)) {
		val = this.normalize(val);

		if (this._value !== val) {
			this._value = val;

			this.respondTo('inspectorValueChanged', this);
		}
	}
};
