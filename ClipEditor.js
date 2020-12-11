/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function ClipEditor(model, view, inspectors, panel = false, timing = false) {
	Editor.call(this, model, view, inspectors, panel);

	this._timing = timing;
}

ClipEditor.prototype = Object.create(Editor.prototype);

Object.defineProperty(ClipEditor.prototype, 'constructor', { value: ClipEditor, enumerable: false, writable: true });

ClipEditor.prototype.modelSet = function(sender) {
	Editor.prototype.modelSet.call(this, sender);

	if (this._timing)
		this._timing.widget.innerText = this._view.duration;
};

ClipEditor.prototype.modelValueChanged = function(sender, prop, val) {
	Editor.prototype.modelValueChanged.call(this, sender, prop, val);

	if (this._timing)
		this._timing.widget.innerText = this._view.duration;
};
