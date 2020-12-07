/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    3
 * @link       http://www.objectivejs.org
 */

"use strict";

function UndoPanel() {
	Panel.call(this);
}

UndoPanel.prototype = Object.create(Panel.prototype);

Object.defineProperty(UndoPanel.prototype, 'constructor', { value: UndoPanel, enumerable: false, writable: true });

UndoPanel.prototype.disable = function() {
	this.disableUndo();
	this.disableRedo();

	return this;
}

UndoPanel.prototype.enable = function() {
	this.enableUndo();
	this.enableRedo();

	return this;
}

UndoPanel.prototype.setWidget = function(w) {
	Panel.prototype.setWidget.call(this, w);

	let [undoWidget, redoWidget] = w.querySelectorAll('button');

	if (undoWidget) {
		undoWidget.addEventListener('click', () => {
		    this.respondTo('undo', this);
		});
	}

	this._undoWidget = undoWidget;

	if (redoWidget) {
		redoWidget.addEventListener('click', () => {
			this.respondTo('redo', this);
		});
	}

	this._redoWidget = redoWidget;

	return this;
}

UndoPanel.prototype.enableUndo = function() {
	if (this._undoWidget)
		this._undoWidget.disabled = false;

	return this;
}

UndoPanel.prototype.disableUndo = function() {
	if (this._undoWidget)
		this._undoWidget.disabled = true;

	return this;
}

UndoPanel.prototype.enableRedo = function() {
	if (this._redoWidget)
		this._redoWidget.disabled = false;

	return this;
}

UndoPanel.prototype.disableRedo = function() {
	if (this._redoWidget)
		this._redoWidget.disabled = true;

	return this;
}
