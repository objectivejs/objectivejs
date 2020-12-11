/**
 *
 * @copyright  2020 objectivejs.org
 * @version    3
 * @link       http://www.objectivejs.org
 */

"use strict";

function SequenceInspector(inspectors) {
	Inspector.call(this);

	for (let p in inspectors)
		inspectors[p].addNextResponder(this);

	this._inspectors = inspectors;
}

SequenceInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(SequenceInspector.prototype, 'constructor', { value: SequenceInspector, enumerable: false, writable: true });

SequenceInspector.prototype.get = function() {
	let value = {};

	for (let p in this._inspectors)
		value[p] = this._inspectors[p].get();

	return value;
}

SequenceInspector.prototype.set = function(val) {
	for (let p in val)
		if (! this._inspectors[p].set(val[p]))
			return false;

	return true;
}

SequenceInspector.prototype.reset = function() {
	for (let p in this._inspectors)
		if (! this._inspectors[p].reset())
			return false;

	return true;
}

SequenceInspector.prototype.disable = function() {
	for (let p in this._inspectors)
		this._inspectors[p].disable();

    return this;
}

SequenceInspector.prototype.enable = function() {
	for (let p in this._inspectors)
		this._inspectors[p].enable();

	return this;
}

SequenceInspector.prototype.inspectorFor = function(p) {
	return this._inspectors[p];
}

SequenceInspector.prototype.inspectorValueChanged = function(sender) {
	this.nextRespondTo('inspectorValueChanged', this);

	return true;
}

SequenceInspector.prototype.resetWidget = function() {
	for (let p in this._inspectors)
		this._inspectors[p].resetWidget();

	return this;
}

SequenceInspector.prototype.setWidget = function(w) {
	View.prototype.setWidget.call(this, w);

	return this;
}

SequenceInspector.prototype.destroyWidget = function() {
	for (let p in this._inspectors)
		this._inspectors[p].destroyWidget();

	View.prototype.destroyWidget.call(this);

	return this;
}
