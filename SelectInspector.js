/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function SelectInspector(value, options = false) {
	options = options || {};

	let tags = options.tags;

	if (typeof value !== 'string')
		throw new TypeError();

	if (! (Array.isArray(tags) && tags.length > 0 && tags.every((e) => typeof e === 'string')))
		throw new TypeError();

	if (tags.indexOf(value) == -1)
		throw new RangeError();

	Inspector.call(this);

	this._tags = tags;

	this._value = value;
}

SelectInspector.prototype = Object.create(Inspector.prototype);

Object.defineProperty(SelectInspector.prototype, 'constructor', { value: SelectInspector, enumerable: false, writable: true });

SelectInspector.prototype.validate = function(val) {
	return typeof val === 'string' && this._tags.indexOf(val) != -1;
}

SelectInspector.prototype.createWidget = function(options = false) {
	options = options || {};

	let htmlclass = options.htmlClass;

	const htmloptions = [];

	for (let opt of this._tags)
		htmloptions.push(`<option value="${opt}">${opt}</option>`);

	const html = `<select size="1"${htmlclass ? ` class="${htmlclass}"` : ''}>\n${htmloptions.join('\n')}\n</select>`;

	let template = document.createElement('template');

	template.innerHTML = html;

	let widget = template.content.children[0];

	this.setWidget(widget);

	return this;
}
