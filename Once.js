/**
 *
 * @copyright  2019 so-o.org
 * @version    1
 * @link       http://www.so-o.org
 */

"use strict";

function Once() {
    return this.constructor._instance || (this.constructor._instance = this);
}

Once.prototype = Object.create(Objective.prototype);

Object.defineProperty(Once.prototype, 'constructor', { value: Once, enumerable: false, writable: true });
