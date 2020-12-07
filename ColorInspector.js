/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function ColorInspector(value = ColorInspector.defaultColor) {
	if (!Validator.validateColor(value))
		throw new TypeError();

	Inspector.call(this);

	this._value = Validator.normalizeColor(value);
}

ColorInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(ColorInspector.prototype, 'constructor', { value: ColorInspector, enumerable: false, writable: true });

ColorInspector.defaultColor = '#000000';

ColorInspector.prototype.validate = function(val) {
	return Validator.validateColor(val);
}

ColorInspector.prototype.normalize = function(val) {
	return Validator.normalizeColor(val);
}

ColorInspector.prototype.resetWidget = function() {
	this._widget.value = this._value;

	jQuery(this._widget).minicolors('value', this._value);

	return this;
}

ColorInspector.prototype.manageWidget = function(parent = null) {
	Inspector.prototype.manageWidget.call(this, parent);

    if (this._parent && this._widget) {
		jQuery(this._widget).minicolors({
    		letterCase: 'uppercase',
    		defaultColor: ColorInspector.defaultColor,
    		hide: function() {
    			this.dispatchEvent(new Event('change'));
    		}
    	});
    }

	return this;
}

ColorInspector.prototype.unmanageWidget = function() {
    if (this._widget)
		jQuery(this._widget).minicolors('destroy');

	Inspector.prototype.unmanageWidget.call(this);

	return this;
}

ColorInspector.prototype.createWidget = function() {
	const htmlinput = `<input type="text" size="8" maxlength="7" value="${this._value}" spellcheck="false" />`;

	let template = document.createElement('template');

    template.innerHTML = htmlinput;

    let widget = template.content.children[0];

	this.setWidget(widget);

	return this;
}
