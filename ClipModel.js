/**
 *
 * @copyright  2019-2021 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function ClipModel(clipname = null) {
	Model.call(this, clipname);
}

ClipModel.prototype = Object.create(Model.prototype);

Object.defineProperty(ClipModel.prototype, 'constructor', { value: ClipModel, enumerable: false, writable: true });
