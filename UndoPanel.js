/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function UndoPanel() {
	Panel.call(this);

	this._undoWidget = null;
	this._redoWidget = null;
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

UndoPanel.prototype.resetWidget = function() {
	this._undoWidget.disabled = true;
	this._redoWidget.disabled = true;

	return this;
}

UndoPanel.prototype.setWidget = function(w) {
	let undo = w.children[0], redo = w.children[1];

	Panel.prototype.setWidget.call(this, w);

	if (undo) {
		undo.addEventListener('click', () => {
		    this.respondTo('undo', this);
		});
	}

	this._undoWidget = undo;

	if (redo) {
		redo.addEventListener('click', () => {
			this.respondTo('redo', this);
		});
	}

	this._redoWidget = redo;

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
