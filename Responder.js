/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    3
 * @link       http://www.objectivejs.org
 */

"use strict";

function Responder() {
}

Responder.prototype = Object.create(Objective.prototype);

Object.defineProperty(Responder.prototype, 'constructor', { value: Responder, enumerable: false, writable: true });

Object.defineProperty(Responder.prototype, 'nextResponders', {
	get:	function() {
		return this._nextResponders || null;
	},
	set:	function(responders) {
		if (! (responders === null || (Array.isArray(responders) && responders.every((r) => r instanceof Responder))))
			throw new TypeError();

		this._nextResponders = responders;
	}
});

Responder.prototype.addNextResponder = function(r) {
	if (!( r instanceof Responder))
		throw new TypeError();

	if (! this._nextResponders)
		this._nextResponders = [r];
	else if (this._nextResponders.indexOf(r) == -1)
		this._nextResponders.push(r);

	return this;
};

Responder.prototype.removeNextResponder = function(r) {
	if (this._nextResponders) {
		let i = this._nextResponders.indexOf(r);

		if (i != -1)
			this._nextResponders.splice(i, 1);
	}

	return this;
};

Responder.prototype.respondTo = function(f, ...args) {
	if (typeof this[f] === 'function' && this[f](...args))
		return this;

	if (! this._nextResponders)
		return this;

	for (let r of this._nextResponders)
		r.respondTo(f, ...args);

	return this;
};

Responder.prototype.nextRespondTo = function(f, ...args) {
	if (this._nextResponders)
		for (let r of this._nextResponders)
			r.respondTo(f, ...args);

	return this;
};
