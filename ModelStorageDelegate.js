/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function ModelStorageDelegate(mode = 'session') {
	if (! (mode == 'session' || mode == 'local'))
		throw new TypeError();

	this._storage = mode == 'local' ? localStorage : sessionStorage;
}

ModelStorageDelegate.prototype = Object.create(Objective.prototype);

Object.defineProperty(ModelStorageDelegate.prototype, 'constructor', { value: ModelStorageDelegate, enumerable: false, writable: true });

ModelStorageDelegate.prototype.isSaved = function(model) {
	return this._storage.getItem(model.name) !== null;
}

ModelStorageDelegate.prototype.readIn = function(model) {
	let json = this._storage.getItem(model.name);

	if (json !== null)
		model.set(JSON.parse(json));
}

ModelStorageDelegate.prototype.writeOut = function(model) {
	this._storage.setItem(model.name, JSON.stringify(model.get()));

	model.changed = false;
}

ModelStorageDelegate.prototype.clearSave = function(model) {
	this._storage.removeItem(model.name);
}
