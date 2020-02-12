/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function TeletypeModel(clipname) {
	ClipModel.call(this, clipname);

	this._value = {
		width: 			TeletypeModel.defaultWidth,
		height: 		TeletypeModel.defaultHeight,
		text:			TeletypeModel.defaultText,
		textFont:		TeletypeModel.defaultTextFont,
		textSize:		TeletypeModel.defaultTextSize,
		textBold:		TeletypeModel.defaultTextBold,
		textColor: 		TeletypeModel.defaultTextColor,
		textAlignment:	TeletypeModel.defaultTextAlignment,
		textWidth: 		TeletypeModel.defaultTextWidth,
		interval:		TeletypeModel.defaultInterval
	};
}

TeletypeModel.prototype = Object.create(ClipModel.prototype);

Object.defineProperty(TeletypeModel.prototype, 'constructor', { value: TeletypeModel, enumerable: false, writable: true });

TeletypeModel.defaultWidth = 320;
TeletypeModel.defaultHeight = 40;
TeletypeModel.defaultText = '';	// 'Objective.js';
TeletypeModel.defaultTextFont = 'Open Sans';
TeletypeModel.defaultTextSize = 22;
TeletypeModel.defaultTextBold = true;
TeletypeModel.defaultTextColor = '#cccccc';
TeletypeModel.defaultTextAlignment = 'left';
TeletypeModel.defaultTextWidth = 20;
TeletypeModel.defaultInterval = 200;

TeletypeModel.minWidth = 120;
TeletypeModel.maxWidth = 960;
TeletypeModel.minHeight = 10;
TeletypeModel.maxHeight = 540;
TeletypeModel.minTextLength = 0;
TeletypeModel.maxTextLength = 200;
TeletypeModel.minTextSize = 10;
TeletypeModel.maxTextSize = 60;
TeletypeModel.minTextWidth = 10;
TeletypeModel.maxTextWidth = 100;
TeletypeModel.minInterval = 100;
TeletypeModel.maxInterval = 500;

TeletypeModel.textAlignmentOptions = Validator.textAlignmentOptions;

TeletypeModel.prototype.validateValue = function(prop, val) {
	if (prop == 'width')
		return Number.isInteger(val);

	if (prop == 'height')
		return Number.isInteger(val);

	if (prop == 'text')
		return typeof val === 'string' && val.length >= TeletypeModel.minTextLength;

	if (prop == 'textFont')
		return typeof val === 'string';

	if (prop == 'textSize')
		return Number.isInteger(val);

	if (prop == 'textColor')
		return Validator.validateColor(val);

	if (prop == 'textAlignment')
		return Validator.validateTextAlignment(val);

	if (prop == 'textWidth')
		return Number.isInteger(val);

	if (prop == 'interval')
		return Number.isInteger(val);

	return true;
}

TeletypeModel.prototype.normalizeValue = function(prop, val) {
	if (prop == 'width') {
		if (val < TeletypeModel.minWidth)
			val = TeletypeModel.minWidth;
		else if (val > TeletypeModel.maxWidth)
			val = TeletypeModel.maxWidth;
	}
	else if (prop == 'height') {
		if (val < TeletypeModel.minHeight)
			val = TeletypeModel.minHeight;
		else if (val > TeletypeModel.maxHeight)
			val = TeletypeModel.maxHeight;
	}
	else if (prop == 'text') {
		if (val.length > TeletypeModel.maxTextLength)
			val = val.substring(0, TeletypeModel.maxTextLength);
	}
	else if (prop == 'textSize') {
		if (val < TeletypeModel.minTextSize)
			val = TeletypeModel.minTextSize;
		else if (val > TeletypeModel.maxTextSize)
			val = TeletypeModel.maxTextSize;
	}
	else if (prop == 'textBold')
		val = val ? true : false;
	else if (prop == 'textColor')
		val = Validator.normalizeColor(val);
	else if (prop == 'textWidth') {
		if (val < TeletypeModel.minTextWidth)
			val = TeletypeModel.minTextWidth;
		else if (val > TeletypeModel.maxTextWidth)
			val = TeletypeModel.maxTextWidth;
	}
	else if (prop == 'interval') {
		if (val < TeletypeModel.minInterval)
			val = TeletypeModel.minInterval;
		else if (val > TeletypeModel.maxInterval)
			val = TeletypeModel.maxInterval;
	}

	return val;
}
