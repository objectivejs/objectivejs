/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function View() {
	Responder.call(this);

	this._parent = null;
	this._widget = null;
}

View.prototype = Object.create(Responder.prototype);

Object.defineProperty(View.prototype, 'constructor', { value: View, enumerable: false, writable: true });

Object.defineProperty(View.prototype, 'widget', {
	get:	function() {
				return this._widget;
			}
});

View.prototype.interfaced = function() {
	return this._widget ? true : false;
}

View.prototype.isManaged = function() {
	return this._widget && this._parent && this._widget.parentElement === this._parent ? true : false;
}

View.prototype.isHidden = function() {
	return this._widget && this._widget.hidden === true;
}

View.prototype.isDisabled = function() {
	return this._widget && this._widget.disabled === true;
}

View.prototype.isEnabled = function() {
	return this._widget && this._widget.disabled === false;
}

View.prototype.hide = function() {
	if (this._widget)
		this._widget.hidden = true;

    return this;
}

View.prototype.show = function() {
	if (this._widget)
		this._widget.hidden = false;

    return this;
}

View.prototype.disable = function() {
	if (this._widget)
		this._widget.disabled = true;

    return this;
}

View.prototype.enable = function() {
	if (this._widget)
		this._widget.disabled = false;

	return this;
}

View.prototype.setStyle = function(prop, val) {
	if (this._widget)
		this._widget.style[prop] = val;

	return this;
}

View.prototype.setAttribute = function(attr, val) {
	if (this._widget)
		this._widget.setAttribute(attr, val);

	return this;
}

View.prototype.removeAttribute = function(attr) {
	if (this._widget)
		this._widget.removeAttribute(attr);

	return this;
}

View.prototype.addFont = function(font) {
	let link = document.createElement('link');

	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('href', `https://fonts.googleapis.com/css?family=${font.replace(/ +/, '+')}`);

	document.head.appendChild(link);

	return this;
}

View.prototype.addClass = function(c) {
	if (this._widget)
		this._widget.classList.add(c);

	return this;
}

View.prototype.removeClass = function(c) {
	if (this._widget)
		this._widget.classList.remove(c);

	return this;
}

View.prototype.toggleClass = function(c) {
	if (this._widget)
		this._widget.classList.toggle(c);

	return this;
}

View.prototype.hasClass = function(c) {
	return this._widget ? this._widget.classList.contains(c) : false;
}

View.prototype.addEventListener = function(type, listener, ...args) {
	if (this._widget)
		this._widget.addEventListener(type, listener, ...args);

	return this;
}

View.prototype.removeEventListener = function(type, listener, ...args) {
	if (this._widget)
		this._widget.removeEventListener(type, listener, ...args);

	return this;
}

View.prototype.dispatchEvent = function(event) {
	if (this._widget)
		this._widget.dispatchEvent(event);

	return this;
}

View.prototype.resetWidget = function() {
	return this;
}

View.prototype.manageWidget = function(parent = null) {
    if (parent)
    	this._parent = parent;

    if (this._parent && this._widget)
		this._parent.appendChild(this._widget);

	return this;
}

View.prototype.unmanageWidget = function() {
	if (this._parent && this._widget)
		this._parent.removeChild(this._widget);

	return this;
}

View.prototype.setWidget = function(w) {
    this._widget = w;

    return this;
}

View.prototype.setManagedWidget = function(w) {
    this._parent = w.parentElement;

	this.setWidget(w);

	return this;
}

View.prototype.createWidget = function() {
	return this;
}

View.prototype.createManagedWidget = function(parent, ...args) {
	this.createWidget(...args);
	this.manageWidget(parent);

	return this;
}

View.prototype.destroyWidget = function() {
	this.unmanageWidget();

	this._widget = null;

	return this;
}
