/**
 *
 * @copyright  2020 objectivejs.org
 * @version    5
 * @link       http://www.objectivejs.org
 */

"use strict";

function SetOfInspector(inspector, options = false) {
	if (!( inspector instanceof Inspector))
		throw new TypeError();

	options = options || {};

	let defaultItem = options.defaultItem;

	let min = options.min;
	let max = options.max;

	if (! (typeof min === 'undefined' || Number.isInteger(min)))
		throw new TypeError();

	if (! (typeof max === 'undefined' || Number.isInteger(max)))
		throw new TypeError();

	if (typeof min === 'number' && min < 1)
		throw new RangeError();

	if (typeof max === 'number' && max < 1)
		throw new RangeError();

	if (typeof min === 'number' && typeof max === 'number' && min > max)
		throw new RangeError();

	Inspector.call(this);

	inspector.addNextResponder(this);

	this._inspector = inspector;

	this._defaultItem = defaultItem;

	this._min = min;
	this._max = max;

	this._pos = 1;

	this._value = [];
}

SetOfInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(SetOfInspector.prototype, 'constructor', { value: SetOfInspector, enumerable: false, writable: true });

Object.defineProperty(SetOfInspector.prototype, 'itemIndex', {
	get:	function() {
		return this._pos;
	},
	set:	function(pos) {
		if (!Number.isInteger(pos))
			throw new TypeError();

		const len = this._value.length || 1;

		if (pos == -1)
			this._pos = len;
		else if (pos < 1 || pos > len)
			throw new RangeError();
		else
			this._pos = pos;

		this.resetWidget();
	}
});

Object.defineProperty(SetOfInspector.prototype, 'defaultItem', {
	get:	function() {
		return this._defaultItem;
	},
	set:	function(val) {
		this._defaultItem = val;
	}
});

SetOfInspector.prototype.validate = function(val) {
	return val === null || Array.isArray(val);
};

SetOfInspector.prototype.normalize = function(val) {
	if (val === null)
		val = [];
	else if (this._max !== undefined && val.length > this._max)
		val = val.slice(0, this._max);

	return val;
};

SetOfInspector.prototype.get = function() {
	return this._value.length > 0 ? Array.from(this._value) : null;
};

SetOfInspector.prototype.set = function(val) {
	if (!this.validate(val))
		return false;

	val = this.normalize(val);

	if (this._value !== val) {
		this._value = val === null ? null : Array.from(val);

		if (val === null || this._pos > val.length)
			this._pos = 1;

		this.resetWidget();
	}

	return true;
};

SetOfInspector.prototype.reset = function() {
	return this._inspector.reset();
};

SetOfInspector.prototype.disable = function() {
	this._inspector.disable();

	if (this._previousWidget)
		this._previousWidget.disabled = true;

	if (this._nextWidget)
		this._nextWidget.disabled = true;

	if (this._addWidget)
		this._addWidget.disabled = true;

	if (this._insertWidget)
		this._insertWidget.disabled = true;

	if (this._removeWidget)
		this._removeWidget.disabled = true;

	if (this._shiftWidget)
		this._shiftWidget.disabled = true;

	if (this._unshiftWidget)
		this._unshiftWidget.disabled = true;

	if (this._posWidget)
		this._posWidget.hidden = true;

	return this;
};

SetOfInspector.prototype.enable = function() {
	this._inspector.enable();

	if (this._previousWidget)
		this._previousWidget.disabled = this._value.length <= 1;

	if (this._nextWidget)
		this._nextWidget.disabled = this._value.length <= 1;

	if (this._addWidget)
		this._addWidget.disabled = this._max && this._value.length >= this._max;

	if (this._insertWidget)
		this._addWidget.disabled = this._max && this._value.length >= this._max;

	if (this._removeWidget)
		this._removeWidget.disabled = this._min && this._value.length <= this._min;

	if (this._shiftWidget)
		this._shiftWidget.disabled = this._value.length <= 1;

	if (this._unshiftWidget)
		this._unshiftWidget.disabled = this._value.length <= 1;

	if (this._posWidget)
		this._posWidget.hidden = false;

	return this;
};

SetOfInspector.prototype.inspectorValueChanged = function(sender) {
	this._value[this._pos-1] = sender.get();

	this.nextRespondTo('inspectorValueChanged', this);

	return true;
};

SetOfInspector.prototype.forward = function(f, ...args) {
	this._inspector.forwardTo(f, args);
};

SetOfInspector.prototype.addItem = function() {
	if (this._max && this._value.length >= this._max)
		return false;

	this._value.splice(this._pos, 0, this.defaultItem);

	if (this._value.length == 1)
		this._pos = 1;
	else
		this._pos++;

	this.resetWidget();

	return true;
};

SetOfInspector.prototype.insertItem = function() {
	if (this._max && this._value.length >= this._max)
		return false;

	this._value.splice(this._pos-1, 0, this.defaultItem);

	this.resetWidget();

	return true;
};

SetOfInspector.prototype.removeItem = function() {
	if (this._value.length == 0 || (this._min && this._value.length <= this._min))
		return false;

	this._value.splice(this._pos-1, 1);

	if (this._value.length == 0)
		this._pos = 1;
	else if (this._pos > this._value.length)
		this._pos = this._value.length;

	this.resetWidget();

	return true;
};

SetOfInspector.prototype.moveItem = function(from, to = false) {
	if (this._value.length <= 1)
		return false;

	if (to === false)
		to = from, from = this._pos;

	if (from < 1 || to < 1 || from == to || from > this._value.length || to > this._value.length)
		return false;

	const val = this._value[from-1];

	this._value[from-1] = this._value[to-1];
	this._value[to-1] = val;

	this.resetWidget();

	return true;
};

SetOfInspector.prototype.shiftItem = function() {
	if (this._value.length <= 1)
		return false;

	const from = this._pos;
	const to = from == 1 ? this._value.length : from-1;

	const val = this._value[from-1];

	this._value.splice(from-1, 1);
	this._value.splice(to-1, 0, val);

	this._pos = to;

	this.resetWidget();

	return true;
};

SetOfInspector.prototype.unshiftItem = function() {
	if (this._value.length <= 1)
		return false;

	const from = this._pos;
	const to = from == this._value.length ? 1 : from+1;

	const val = this._value[from-1];

	this._value.splice(from-1, 1);
	this._value.splice(to-1, 0, val);

	this._pos = to;

	this.resetWidget();

	return true;
};

SetOfInspector.prototype.setPreviousWidget = function(w) {
	w.addEventListener('click', () => {
		if (this._value.length > 0) {
			this._pos = this._pos == 1 ? this._value.length : this._pos-1;

			this.resetWidget();
		}
	});

	w.disabled = this._value.length <= 1;

	this._previousWidget = w;

	return this;
};

SetOfInspector.prototype.setNextWidget = function(w) {
	w.addEventListener('click', () => {
		if (this._value.length > 0) {
			this._pos = this._pos == this._value.length ? 1 : this._pos+1;

			this.resetWidget();
		}
	});

	w.disabled = this._value.length <= 1;

	this._nextWidget = w;

	return this;
};

SetOfInspector.prototype.setAddWidget = function(w) {
	w.addEventListener('click', () => {
		if (this.addItem())
			this.nextRespondTo('inspectorValueChanged', this);
	});

	w.disabled = this._max && this._value.length >= this._max;

	this._addWidget = w;

	return this;
};

SetOfInspector.prototype.setInsertWidget = function(w) {
	w.addEventListener('click', () => {
		if (this.insertItem())
			this.nextRespondTo('inspectorValueChanged', this);
	});

	w.disabled = this._max && this._value.length >= this._max;

	this._insertWidget = w;

	return this;
};

SetOfInspector.prototype.setRemoveWidget = function(w) {
	w.addEventListener('click', () => {
		if (this.removeItem())
			this.nextRespondTo('inspectorValueChanged', this);
	});

	w.disabled = this._min && this._value.length <= this._min;

	this._removeWidget = w;

	return this;
};

SetOfInspector.prototype.setShiftWidget = function(w) {
	w.addEventListener('click', () => {
		if (this.shiftItem())
			this.nextRespondTo('inspectorValueChanged', this);
	});

	w.disabled = this._value.length <= 1;

	this._shiftWidget = w;

	return this;
};


SetOfInspector.prototype.setUnshiftWidget = function(w) {
	w.addEventListener('click', () => {
		if (this.unshiftItem())
			this.nextRespondTo('inspectorValueChanged', this);
	});

	w.disabled = this._value.length <= 1;

	this._unshiftWidget = w;

	return this;
};

SetOfInspector.prototype.setIndexWidget = function(w) {
	w.innerText = this._value.length > 0 ? `${this._pos} / ${this._value.length}` : '';

	this._posWidget = w;

	return this;
};

SetOfInspector.prototype.resetWidget = function() {
	this._inspector.set(this._value[this._pos-1]);

	if (this._previousWidget)
		this._previousWidget.disabled = this._value.length <= 1;

	if (this._nextWidget)
		this._nextWidget.disabled = this._value.length <= 1;

	if (this._addWidget)
		this._addWidget.disabled = this._max && this._value.length >= this._max;

	if (this._insertWidget)
		this._insertWidget.disabled = this._max && this._value.length >= this._max;

	if (this._removeWidget)
		this._removeWidget.disabled = this._min && this._value.length <= this._min;

	if (this._shiftWidget)
		this._shiftWidget.disabled = this._value.length <= 1;

	if (this._unshiftWidget)
		this._unshiftWidget.disabled = this._value.length <= 1;

	if (this._posWidget)
		this._posWidget.innerText = this._value.length > 0 ? `${this._pos} / ${this._value.length}` : '';

	return this;
};

SetOfInspector.prototype.setWidget = function(w) {
	View.prototype.setWidget.call(this, w);

	return this;
};

SetOfInspector.prototype.destroyWidget = function() {
	this._inspector.destroyWidget();

	View.prototype.destroyWidget.call(this);

	return this;
};
