/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function ClipModel(clipname) {
	Model.call(this, clipname);
}

ClipModel.prototype = Object.create(Model.prototype);

Object.defineProperty(ClipModel.prototype, 'constructor', { value: ClipModel, enumerable: false, writable: true });
