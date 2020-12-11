/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function Validator() {
}

Validator.prototype = Object.create(Objective.prototype);

Object.defineProperty(Validator.prototype, 'constructor', { value: Validator, enumerable: false, writable: true });

Validator.validateColor = function(color) {
	return typeof color === 'string' && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color);
};

Validator.normalizeColor = function(color) {
	return color.length == 4 ? color.replace(/([0-9a-fA-F])/g, '$1$1').toLowerCase() : color.toLowerCase();
};

Validator.easingOptions = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out' ];

Validator.validateEasing = function(easing) {
	return typeof easing === 'string' && Validator.easingOptions.indexOf(easing) != -1;
};

Validator.textAlignmentOptions = ['left', 'center', 'right' ];

Validator.validateTextAlignment = function(alignment) {
	return typeof alignment === 'string' && Validator.textAlignmentOptions.indexOf(alignment) != -1;
};

Validator.validateFileName = function(filename) {
	return typeof filename === 'string' &&  /^[a-zA-Z]+[0-9a-zA-Z._-]*(.[0-9a-zA-Z]+)?$/.test(filename);
};

Validator.validateCookieName = function(cookiename) {
	return typeof cookiename === 'string' &&  /^[a-zA-Z]+[0-9a-zA-Z._-]*$/.test(cookiename);
};

Validator.validateModelName = function(modelname) {
	return Validator.validateCookieName(modelname);
};

Validator.validateImageDataURL = function(dataurl) {
	return typeof dataurl === 'string' && /^data:image\/[-.+0-9a-zA-Z]+;base64,/.test(dataurl);
};
