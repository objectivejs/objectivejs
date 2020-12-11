/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function Undo(size = 100) {
	if (! Number.isInteger(size))
		throw new TypeError();

	if (size < 1)
		throw new RangeError();

	this._size = size;

	this._undo = [];
	this._redo = null;
}

Object.defineProperty(Undo.prototype, 'size', {
	get:	function() {
		return this._size;
	},
	set:	function(n) {
		if (! Number.isInteger(n))
			throw new TypeError();

		if (n < 1)
			throw new RangeError();

		if (this._size > n)
			this._undo = this._undo.slice(-n);

		this._redo = null;

		this._size = n;
	}
});

Object.defineProperty(Undo.prototype, 'undoLength', {
	get:	function() {
		return this._undo.length;
	}
});

Object.defineProperty(Undo.prototype, 'redoLength', {
	get:	function() {
		return this._redo === null ? 0 : this._redo.length;
	}
});

Undo.prototype.push = function(f, ...args) {
	if (this._undo.length >= this._size)
		this._undo.shift();

	this._undo.push(args.length ? [f, args] : f);

	this._redo = null;

	return this;
};

Undo.prototype.pop = function() {
	this._undo.pop();

	this._redo = null;

	return this;
};

Undo.prototype.undo = function() {
	let exp = this._undo.pop();

	if (exp === undefined)
		return false;

	let redo = this._redo;

	if (Array.isArray(exp))
		exp[0](...exp[1]);
	else
		exp();

	exp = this._undo.pop();

	if (exp === undefined)
		return true;

	this._redo = redo;

	if (this._redo === null)
		this._redo = [];
	else if (this._redo.length >= this._size)
		this._redo.shift();

	this._redo.push(exp);

	return true;
};

Undo.prototype.redo = function() {
	if (! this._redo)
		return false;

	let exp = this._redo.pop();

	if (exp === undefined)
		return false;

	let redo = this._redo;

	if (Array.isArray(exp))
		exp[0](...exp[1]);
	else
		exp();

	this._redo = redo;

	return true;
};

Undo.prototype.clear = function() {
	this._undo = [];
	this._redo = null;

	return this;
};
