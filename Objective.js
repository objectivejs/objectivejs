/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function Objective() {
}

Objective.prototype.clone = function() {
	return Object.assign(Object.create(this), this);
}

Objective.prototype.delegate = function(f = null, ...args) {
	let d = this._delegate;

	if (f === null)
		return d;

	if (d === undefined)
		return undefined;

	if (! (f in d && typeof d[f] === 'function'))
		return undefined;

	return d[f](...args);
}

Objective.prototype.setDelegate = function(d) {
	if (! (d === null || (typeof d === 'object')))
		throw new TypeError();

	this._delegate = d;

	return this;
}

Objective.prototype.hasListener = function(l) {
	return this._listeners !== undefined && this._listeners.indexOf(l) != -1;
}

Objective.prototype.addListener = function(l) {
	if (this._listeners === undefined)
		this._listeners = [l];
	else if (this._listeners.indexOf(l) == -1)
		this._listeners.push(l);

	return this;
}

Objective.prototype.removeListener = function(l) {
	if (this._listeners !== undefined) {
		let i = this._listeners.indexOf(l);

		if (i != -1)
			this._listeners.splice(i, 1);
	}

	return this;
}

Objective.prototype.notify = function(f, ...args) {
	if (this._listeners !== undefined) {
    	for (let l of this._listeners)
    		l.forwardTo(f, ...args)
    }

    return this;
}

Objective.prototype.forwardTo = function(f, ...args) {
	if (typeof this[f] === 'function')
		this[f](...args);
	else
		this.forward(f, ...args);
}

Objective.prototype.forward = function(f, ...args) {
}
