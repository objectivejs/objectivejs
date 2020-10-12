/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function ModelCookieDelegate() {
}

ModelCookieDelegate.prototype = Object.create(Objective.prototype);

Object.defineProperty(ModelCookieDelegate.prototype, 'constructor', { value: ModelCookieDelegate, enumerable: false, writable: true });

ModelCookieDelegate.prototype.isSaved = function(model) {
	return Cookies.get(model.name) !== undefined;
}

ModelCookieDelegate.prototype.readIn = function(model) {
	let json = Cookies.get(model.name);

	if (json !== undefined)
		model.set(JSON.parse(json));
}

ModelCookieDelegate.prototype.writeOut = function(model) {
	Cookies.set(model.name, JSON.stringify(model.get()), { path: '/', sameSite: 'lax' });

	model.changed = false;
}

ModelCookieDelegate.prototype.clearSave = function(model) {
	Cookies.remove(model.name, { path: '/' });
}
