/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function EmblemModel(clipname) {
	ClipModel.call(this, clipname);

	this._value = {
		size: 		EmblemModel.defaultSize,
		text:		EmblemModel.defaultText,
		textFont:	EmblemModel.defaultTextFont,
		textSize:	EmblemModel.defaultTextSize,
		textBold:	EmblemModel.defaultTextBold,
		textColor:	EmblemModel.defaultTextColor,
		duration:	EmblemModel.defaultDuration,
		easing:		EmblemModel.defaultEasing,
		delay:		EmblemModel.defaultDelay
	};
}

EmblemModel.prototype = Object.create(ClipModel.prototype);

Object.defineProperty(EmblemModel.prototype, 'constructor', { value: EmblemModel, enumerable: false, writable: true });

EmblemModel.defaultSize = 160;
EmblemModel.defaultText = '';	// 'London • Paris • ';
EmblemModel.defaultTextFont = 'Open Sans';
EmblemModel.defaultTextSize = 22;
EmblemModel.defaultTextBold = true;
EmblemModel.defaultTextColor = '#cccccc';
EmblemModel.defaultEasing = 'ease-in-out';
EmblemModel.defaultDuration = 5;
EmblemModel.defaultDelay = 1;

EmblemModel.minSize = 120;
EmblemModel.maxSize = 960;
EmblemModel.minTextLength = 0;
EmblemModel.maxTextLength = 40;
EmblemModel.minTextSize = 10;
EmblemModel.maxTextSize = 60;
EmblemModel.minDuration = 1;
EmblemModel.maxDuration = 9;
EmblemModel.minDelay = 0;
EmblemModel.maxDelay = 5;

EmblemModel.easingOptions = Validator.easingOptions;

EmblemModel.prototype.validateValue = function(prop, val) {
	if (prop == 'size')
		return Number.isInteger(val);

	if (prop == 'text')
		return typeof val === 'string' && val.length >= EmblemModel.minTextLength;

	if (prop == 'textFont')
		return typeof val === 'string';

	if (prop == 'textSize')
		return Number.isInteger(val);

	if (prop == 'textColor')
		return Validator.validateColor(val);

	if (prop == 'duration')
		return Number.isInteger(val);

	if (prop == 'delay')
		return Number.isInteger(val);

	if (prop == 'easing')
		return Validator.validateEasing(val);

	return true;
};

EmblemModel.prototype.normalizeValue = function(prop, val) {
	if (prop == 'size') {
		if (val < EmblemModel.minSize)
			val = EmblemModel.minSize;
		else if (val > EmblemModel.maxSize)
			val = EmblemModel.maxSize;
	}
	else if (prop == 'text') {
		if (val.length > EmblemModel.maxTextLength)
			val = val.substring(0, EmblemModel.maxTextLength);
	}
	else if (prop == 'textSize') {
		if (val < EmblemModel.minTextSize)
			val = EmblemModel.minTextSize;
		else if (val > EmblemModel.maxTextSize)
			val = EmblemModel.maxTextSize;
	}
	else if (prop == 'textBold')
		val = val ? true : false;
	else if (prop == 'textColor')
		val = Validator.normalizeColor(val);
	else if (prop == 'duration') {
		if (val < EmblemModel.minDuration)
			val = EmblemModel.minDuration;
		else if (val > EmblemModel.maxDuration)
			val = EmblemModel.maxDuration;
	}
	else if (prop == 'delay') {
		if (val < EmblemModel.minDelay)
			val = EmblemModel.minDelay;
		else if (val > EmblemModel.maxDelay)
			val = EmblemModel.maxDelay;
	}

	return val;
};
