/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function ImageModel(name = null) {
	Model.call(this, name);

	this._value = {
		image:	{ image: null, size: [0, 0] }
	};
}

ImageModel.prototype = Object.create(Model.prototype);

Object.defineProperty(ImageModel.prototype, 'constructor', { value: ImageModel, enumerable: false, writable: true });

ImageModel.prototype.validateValue = function(prop, val) {
	if (prop == 'image') {
		if (typeof val !== 'object')
			return false;

		const { image, size } = val;

		if (image === null)
			return true;

		if (! (Array.isArray(image) && Validator.validateImageDataURL(image[0]) && Number.isInteger(image[1]) && Number.isInteger(image[2]) && image[1] >= 0 && image[2] >= 0))
			return false;

		if (! (Array.isArray(size) && Number.isInteger(size[0]) && Number.isInteger(size[1]) && size[0] >= 0 && size[1] >= 0))
			return false;

		return true;
	}

	return true;
};
