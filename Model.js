/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    3
 * @link       http://www.objectivejs.org
 */

"use strict";

function Model(name = null) {
	if (name !== null && !Validator.validateModelName(name))
		throw new TypeError();

	this._name = name;

	this._value = undefined;
	this._changed = false;

	this._undo = null;

	this._sync = false;
	this._timeout = 0;

	this._timer = null;
}

Model.prototype = Object.create(Objective.prototype);

Object.defineProperty(Model.prototype, 'constructor', { value: Model, enumerable: false, writable: true });

Object.defineProperty(Model.prototype, 'name', {
	get:	function() {
		return this._name;
	}
});

Object.defineProperty(Model.prototype, 'changed', {
	get:	function() {
		return this._changed;
	},
	set:	function(changed) {
		this._changed = changed ? true : false;
	}
});

Model.prototype.get = function() {
	return this._value;
};

Model.prototype.set = function(val) {
	if (this._undo)
		this._undo.clear();

	for (let prop in this._value)
		val[prop] = this.checkValue(prop, val[prop]);

	this._value = val;
	this._changed = false;

	this.notify('modelSet', this);

	if (this._undo)
		this.notify('modelUndoChanged', this);

	return this;
};

Model.prototype.getValue = function(prop) {
	return this._value[prop];
};

Model.prototype.setValue = function(prop, val) {
	val = this.checkValue(prop, val);

	if (this._value[prop] === val)
		return this;

	if (this._undo)
		this._undo.push((val) => this.setValue(prop, val), this._value[prop]);

	this._value[prop] = val;
	this._changed = true;

	if (this._sync)
		this.sync();

	this.notify('modelValueChanged', this, prop, val);

	if (this._undo)
		this.notify('modelUndoChanged', this);

	return this;
};

Model.prototype.validateValue = function(prop, val) {
	return true;
};

Model.prototype.normalizeValue = function(prop, val) {
	return val;
};

Model.prototype.checkValue = function(prop, val) {
	return val === undefined || !this.validateValue(prop, val) ? this.getValue(prop) : this.normalizeValue(prop, val);
};

Model.prototype.readIn = function() {
	this.delegate('readIn', this);

	return this;
};

Model.prototype.writeOut = function() {
	this.delegate('writeOut', this);

	return this;
};

Model.prototype.clearSave = function() {
	this.delegate('clearSave', this);

	return this;
};

Model.prototype.isSaved = function() {
	return !this.changed && (this._delegate === undefined || this.delegate('isSaved', this) === true);
};

Model.prototype.sync = function() {
	if (this._timer)
		return this;

	if (this.timeout > 0)
		this._timer = window.setTimeout(() => { this.writeOut(); this._timer = null; }, this._timeout);
	else
		this.writeOut();

	return this;
};

Model.prototype.haSsync = function() {
	return this._sync;
};

Model.prototype.enableSync = function(timeout = 0) {
	if (!Number.isInteger(timeout))
		throw new TypeError();

	if (timeout < 0)
		throw new RangeError();

	this._timeout = timeout;
	this._sync = true;

	return this;
};

Model.prototype.disableSync = function() {
	if (this._timer) {
		window.clearTimeout(this._timer);

		this._timer = null;
	}

	this._sync = false;

	return this;
};

Model.prototype.hasUndo = function() {
	return this._undo !== null;
};

Model.prototype.enableUndo = function() {
	if (this._undo === null)
		this._undo = new Undo();

	return this;
};

Model.prototype.disableUndo = function() {
	if (this._undo !== null)
		this._undo = null;

	return this;
};

Model.prototype.undo = function() {
	if (this._undo && this._undo.undo())
		this.notify('modelUndoChanged', this);

	return this;
};

Model.prototype.redo = function() {
	if (this._undo && this._undo.redo())
		this.notify('modelUndoChanged', this);

	return this;
};

Model.prototype.canUndo = function() {
	return this._undo && this._undo.undoLength > 0 ? true : false;
};

Model.prototype.canRedo = function() {
	return this._undo && this._undo.redoLength > 0 ? true : false;
};
