/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function ImageSizeInspector(imageInspector, sizeInspector) {
	SequenceInspector.call(this, { image: imageInspector, size: sizeInspector });

	this._imageInspector = imageInspector;
	this._sizeInspector = sizeInspector;
}

ImageSizeInspector.prototype = Object.create(SequenceInspector.prototype);

Object.defineProperty(SequenceInspector.prototype, 'constructor', { value: SequenceInspector, enumerable: false, writable: true });

Object.defineProperty(ImageSizeInspector.prototype, 'imageType', {
	get:	function() {
				return this._imageInspector.type;
			}
});

Object.defineProperty(ImageSizeInspector.prototype, 'imageSize', {
	get:	function() {
				return this._imageInspector.size;
			}
});

Object.defineProperty(ImageSizeInspector.prototype, 'imageWidth', {
	get:	function() {
				return this._imageInspector.width;
			}
});

Object.defineProperty(ImageSizeInspector.prototype, 'imageHeight', {
	get:	function() {
				return this._imageInspector.height;
			}
});

Object.defineProperty(ImageSizeInspector.prototype, 'size', {
	get:	function() {
				return this._sizeInspector.get();
			}
});

ImageSizeInspector.prototype.validate = function(val) {
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

ImageSizeInspector.prototype.set = function(val) {
	if (!this.validate(val))
		return false;

	this._adjustSizeInspector(val);

	SequenceInspector.prototype.set.call(this, val);

	return true;
}

ImageSizeInspector.prototype.inspectorValueChanged = function(sender) {
	if (sender === this._imageInspector)
		this._adjustSizeInspector(this.get());

	this.nextRespondTo('inspectorValueChanged', this);

	return true;
}

ImageSizeInspector.prototype._adjustSizeInspector = function(val) {
	const { image, size } = val;

	if (image !== null) {
		const [data, maxWidth, maxHeight] = image;
		const [width, height] = size;

		const svg = /^data:(image\/[-.+0-9a-zA-Z]+);base64,/.exec(data)[1] === 'image/svg+xml';

		this._sizeInspector.setOptions(maxWidth, maxHeight, { maxWidth: svg ? undefined : maxWidth, maxHeight: svg ? undefined : maxHeight });

		if (width === 0 || height === 0)
			this._sizeInspector.set([maxWidth, maxHeight]);
	}
	else
		this._sizeInspector.setOptions(0);
}
