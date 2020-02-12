/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function Panel() {
	View.call(this);
}

Panel.prototype = Object.create(View.prototype);

Object.defineProperty(Panel.prototype, 'constructor', { value: Panel, enumerable: false, writable: true });
