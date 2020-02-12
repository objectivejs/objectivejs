/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function Editor(model, view, inspectors, panel = false) {
	Responder.call(this);

	model.addListener(this);

	this._model = model;

	if (view)
		view.addListener(this);

	this._view = view;

	for (let p in inspectors)
		inspectors[p].addNextResponder(this);

	this._inspectors = inspectors;

	if (panel) {
		panel.addNextResponder(this);
		model.enableUndo();
	}

	this._panel = panel;
}

Editor.prototype = Object.create(Responder.prototype);

Object.defineProperty(Editor.prototype, 'constructor', { value: Editor, enumerable: false, writable: true });

Editor.prototype.modelSet = function(sender) {
	let options = sender.get();

	if (this._view)
		this._view.set(options);

	let inspectors = this._inspectors;

	for (let p in inspectors)
		inspectors[p].set(options[p])
}

Editor.prototype.modelValueChanged = function(sender, prop, val) {
	if (this._view)
		this._view.setValue(prop, val);

	this._inspectors[prop].set(val);
}

Editor.prototype.modelUndoChanged = function(sender) {
	if (this._panel) {
		if (this._model.canUndo())
			this._panel.enableUndo();
		else
			this._panel.disableUndo();

		if (this._model.canRedo())
			this._panel.enableRedo();
		else
			this._panel.disableRedo();
	}
}

Editor.prototype.undo = function(sender) {
	this._model.undo();

	return true;
}

Editor.prototype.redo = function(sender) {
	this._model.redo();

	return true;
}

Editor.prototype.inspectorValueChanged = function(sender) {
	let inspectors = this._inspectors;

	for (let p in inspectors) {
		if (inspectors[p] === sender) {
			this._model.setValue(p, sender.get());
			break;
		}
	}

	return true;
}

Editor.prototype.disable = function() {
	let inspectors = this._inspectors;

	for (let p in inspectors)
		inspectors[p].disable();

	if (this._panel)
		this._panel.disable();

	return this;
}

Editor.prototype.enable = function() {
	let inspectors = this._inspectors;

	for (let p in inspectors)
		inspectors[p].enable();

	if (this._panel) {
		if (this._model.canUndo())
			this._panel.enableUndo();
		if (this._model.canRedo())
			this._panel.enableRedo();
	}

	return this;
}
