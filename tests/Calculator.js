/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function Calculator(helper = null) {
	this._accu = 0.0;

	if (helper)
		this.setDelegate(helper);
}

Calculator.prototype = Object.create(Objective.prototype);

Object.defineProperty(Calculator.prototype, 'constructor', { value: Calculator, enumerable: false, writable: true });

Object.defineProperty(Calculator.prototype, 'value', {
	get:	function() {
				return this._accu;
			},
	set:	function(n) {
				if (typeof n !== 'number')
					throw new TypeError();

				this._accu = n;
			}
});

Calculator.prototype.clear = function() {
	this._accu = 0.0;

	return this;
}

Calculator.prototype.add = function(val) {
	this._accu += val;

	return this;
}

Calculator.prototype.sub = function(val) {
	this._accu -= val;

	return this;
}

Calculator.prototype.mul = function(val) {
	this._accu *= val;

	return this;
}

Calculator.prototype.div = function(val) {
	this._accu /= val;

	return this;
}

Calculator.prototype.sqrt = function() {
	this._accu = Math.sqrt(this._accu);

	return this;
}

Calculator.prototype.clr = function() {
	this.delegate('clr');

	return this;
}

Calculator.prototype.sto = function() {
	this.delegate('sto', this._accu);

	return this;
}

Calculator.prototype.rcl = function() {
	this._accu = this.delegate('rcl');

	return this;
}

function CalculatorMemory() {
	this._mem = 0.0;
}

CalculatorMemory.prototype = Object.create(Objective.prototype);

Object.defineProperty(CalculatorMemory.prototype, 'constructor', { value: CalculatorMemory, enumerable: false, writable: true });

CalculatorMemory.prototype.clr = function() {
	this._mem = 0.0;

	return this;
}

CalculatorMemory.prototype.sto = function(val) {
	this._mem = val;

	return this;
}

CalculatorMemory.prototype.rcl = function() {
	return this._mem;
}
