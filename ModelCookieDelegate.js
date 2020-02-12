/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function ModelCookieDelegate() {
}

ModelCookieDelegate.prototype = Object.create(Objective.prototype);

Object.defineProperty(ModelCookieDelegate.prototype, 'constructor', { value: ModelCookieDelegate, enumerable: false, writable: true });

ModelCookieDelegate.prototype.isSaved = function(model) {
	return $.cookie(model.name) !== undefined;
}

ModelCookieDelegate.prototype.readIn = function(model) {
	let json = $.cookie(model.name);

	if (json !== undefined)
		model.set(JSON.parse(json));
}

ModelCookieDelegate.prototype.writeOut = function(model) {
	$.cookie(model.name, JSON.stringify(model.get()), { path: '/' });

	model.changed = false;
}

ModelCookieDelegate.prototype.clearSave = function(model) {
	$.removeCookie(model.name, { path: '/' });
}
