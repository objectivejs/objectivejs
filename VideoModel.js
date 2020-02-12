/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function VideoModel(clipname) {
	ClipModel.call(this, clipname);

	this._value = {
		size:	[VideoModel.defaultWidth, VideoModel.defaultHeight],
		hflip: 			VideoModel.defaultHFlip,
		vflip:			VideoModel.defaultVFlip,
		opacity:		VideoModel.defaultOpacity,
		invert:			VideoModel.defaultInvert,
		contrast:		VideoModel.defaultContrast,
		saturate:		VideoModel.defaultSaturate,
		brightness:		VideoModel.defaultBrightness,
		saturate:		VideoModel.defaultSaturate,
		grayscale:		VideoModel.defaultGrayscale,
		sepia:			VideoModel.defaultSepia,
		blur:			VideoModel.defaultBlur
	};
}

VideoModel.prototype = Object.create(ClipModel.prototype);

Object.defineProperty(VideoModel.prototype, 'constructor', { value: VideoModel, enumerable: false, writable: true });

VideoModel.defaultWidth = 480;
VideoModel.defaultHeight = 270;
VideoModel.defaultHFlip = false;
VideoModel.defaultVFlip = false;
VideoModel.defaultOpacity = 1;
VideoModel.defaultInvert = 0;
VideoModel.defaultContrast = 1;
VideoModel.defaultSaturate = 1;
VideoModel.defaultBrightness = 1;
VideoModel.defaultGrayscale = false;
VideoModel.defaultSepia = false;
VideoModel.defaultBlur = false;

VideoModel.minWidth = 240;
VideoModel.maxWidth = 1920;
VideoModel.minHeight = 135;
VideoModel.maxHeight = 1080;
VideoModel.minOpacity = 0;
VideoModel.maxOpacitye = 1;
VideoModel.minInvert = 0;
VideoModel.maxInvert = 1;
VideoModel.minContrast = 0;
VideoModel.maxContrast = 2;
VideoModel.minSaturate = 0;
VideoModel.maxSaturate = 2;
VideoModel.minBrightness = 0;
VideoModel.maxBrightness = 2;

VideoModel.prototype.validateValue = function(prop, val) {
	if (prop == 'size')
		return Array.isArray(val) && typeof val[0] === 'number' && typeof val[1] === 'number';

	if (prop == 'opacity')
		return typeof val === 'number';

	if (prop == 'invert')
		return typeof val === 'number';

	if (prop == 'contrast')
		return typeof val === 'number';

	if (prop == 'saturate')
		return typeof val === 'number';

	if (prop == 'brightness')
		return typeof val === 'number';

	return true;
}

VideoModel.prototype.normalizeValue = function(prop, val) {
	if (prop == 'size') {
		let [w, h] = val;

		if (w < VideoModel.minWidth)
			w = VideoModel.minWidth;
		else if (w > VideoModel.maxWidth)
			w = VideoModel.maxWidth;

		if (h < VideoModel.minHeight)
			h = VideoModel.minHeight;
		else if (h > VideoModel.maxHeight)
			h = VideoModel.maxHeight;

		val = [w, h];
	}
	else if (prop == 'hflip')
		val = val ? true : false;
	else if (prop == 'vflip')
		val = val ? true : false;
	else if (prop == 'grayscale')
		val = val ? true : false;
	else if (prop == 'sepia')
		val = val ? true : false;
	else if (prop == 'blur')
		val = val ? true : false;
	else if (prop == 'opacity') {
		if (val < VideoModel.minOpacity)
			val = VideoModel.minOpacity;
		else if (val > VideoModel.maxOpacity)
			val = VideoModel.maxOpacity;
	}
	else if (prop == 'invert') {
		if (val < VideoModel.minInvert)
			val = VideoModel.minInvert;
		else if (val > VideoModel.maxInvert)
			val = VideoModel.maxInvert;
	}
	else if (prop == 'contrast') {
		if (val < VideoModel.minContrast)
			val = VideoModel.minContrast;
		else if (val > VideoModel.maxContrast)
			val = VideoModel.maxContrast;
	}
	else if (prop == 'saturate') {
		if (val < VideoModel.minSaturate)
			val = VideoModel.minSaturate;
		else if (val > VideoModel.maxSaturate)
			val = VideoModel.maxSaturate;
	}
	else if (prop == 'brightness') {
		if (val < VideoModel.minBrightness)
			val = VideoModel.minBrightness;
		else if (val > VideoModel.maxBrightness)
			val = VideoModel.maxBrightness;
	}

	return val;
}
