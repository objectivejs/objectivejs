/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function ClipController(clip, model = false) {
	if (model)
		model.addListener(this);

	clip.addListener(this);

	this._clip = clip;
}

ClipController.prototype = Object.create(Objective.prototype);

Object.defineProperty(ClipController.prototype, 'constructor', { value: ClipController, enumerable: false, writable: true });

ClipController.prototype.modelSet = function(sender) {
	this._clip.set(sender.get());
};
