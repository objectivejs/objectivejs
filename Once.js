/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    3
 * @link       http://www.objectivejs.org
 */

"use strict";

function Once() {
	return this.constructor._instance || (this.constructor._instance = this);
}

Once.prototype = Object.create(Objective.prototype);

Object.defineProperty(Once.prototype, 'constructor', { value: Once, enumerable: false, writable: true });

Once.prototype.clone = function() {
	return this;
};
