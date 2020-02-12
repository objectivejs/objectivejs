/**
 *
 * @copyright  2019 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function TeletypeClip() {
	ProgramClip.call(this);

	this._text = '';
	this._textWidth = 20;

	this._textWidget = null;
}

TeletypeClip.prototype = Object.create(ProgramClip.prototype);

Object.defineProperty(TeletypeClip.prototype, 'constructor', { value: TeletypeClip, enumerable: false, writable: true });

Object.defineProperty(TeletypeClip.prototype, 'duration', {
	get:	function() {
				return this._text ? (this._text.length + Math.min(this._text.length, this._textWidth) - 1) * this._interval : 0;
			}
});

TeletypeClip.prototype.drawWidget = function() {
	if (this._text) {
		let width = Math.min(this._text.length, this._textWidth);
		let pos = Math.floor(this._currentTime / this._interval);

		this._textWidget.innerText = this._text.substring(pos < width ? 0 : pos - width + 1, pos + 1);
	}

	return this;
}

TeletypeClip.prototype.setWidget = function(w) {
	const span = document.createElement('span');

	w.appendChild(span);

	ProgramClip.prototype.setWidget.call(this, w);

	this._textWidget = span;

	return this;
}

TeletypeClip.prototype.set = function(options) {
	const {width, height, text, textFont, textSize, textBold, textColor, textAlignment, textWidth, interval} = options;

	this.setWidth(width);
	this.setHeight(height);
	this.setText(text);
	this.setTextFont(textFont);
	this.setTextSize(textSize);
	this.setTextBold(textBold);
	this.setTextColor(textColor);
	this.setTextAlignment(textAlignment);

	this.setTextWidth(textWidth);

	this.setInterval(interval);

	return this;
}

TeletypeClip.prototype.setValue = function(prop, val) {
	if (prop == 'width')
		this.setWidth(val);
	else if (prop == 'height')
		this.setHeight(val);
	else if (prop == 'text')
		this.setText(val);
	else if (prop == 'textFont')
		this.setTextFont(val);
	else if (prop == 'textSize')
		this.setTextSize(val);
	else if (prop == 'textBold')
		this.setTextBold(val);
	else if (prop == 'textColor')
		this.setTextColor(val);
	else if (prop == 'textAlignment')
		this.setTextAlignment(val);
	else if (prop == 'textWidth')
		this.setTextWidth(val);
	else if (prop == 'interval')
		this.setInterval(val);

	return this;
}

TeletypeClip.prototype.setWidth = function(px) {
  	this.setStyle('width', `${px}px`);

  	this._width = px;

  	return this;
}

TeletypeClip.prototype.setHeight = function(px) {
  	this.setStyle('height', `${px}px`);

  	this._height = px;

  	return this;
}

TeletypeClip.prototype.setText = function(text) {
	this._text = text;

	if (!this._timer)
		this.showText();

  	return this;
}

TeletypeClip.prototype.setTextFont = function(font) {
	this.addFont(font).setStyle('fontFamily', `"${font}", sans-serif`);

  	return this;
}

TeletypeClip.prototype.setTextSize = function(px) {
  	this.setStyle('fontSize', `${px}px`);

  	return this;
}

TeletypeClip.prototype.setTextBold = function(bold) {
  	this.setStyle('fontWeight', bold ? 'bold' : 'normal');

  	return this;
}

TeletypeClip.prototype.setTextColor = function(color) {
	this.setStyle('color', color);

	return this;
}

TeletypeClip.prototype.setTextAlignment = function(alignment) {
	this._textWidget.style.textAlign = alignment;

  	return this;
}

TeletypeClip.prototype.setTextWidth = function(w) {
	this._textWidth = w;

	if (!this._timer)
		this.showText();

  	return this;
}

TeletypeClip.prototype.showText = function() {
	this._textWidget.innerText = this._text ? this._text.substring(0, this._textWidth) : '';

	return this;
}
