/**
 *
 * @copyright  2019-2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function EmblemClip() {
	AnimateClip.call(this);

	this._options = {duration: 0, delay: 0, easing: 'linear'};
}

EmblemClip.prototype = Object.create(AnimateClip.prototype);

Object.defineProperty(EmblemClip.prototype, 'constructor', { value: EmblemClip, enumerable: false, writable: true });

EmblemClip.prototype._draw = function(text) {
	while (this._widget.firstChild)
		this._widget.removeChild(this._widget.firstChild);

	let angle = 360/text.length;

	for (let i = 0; i < text.length; i++) {
		let span = document.createElement('span');
		let letter = document.createTextNode(text[i]);

		span.appendChild(letter);

		let r = i * angle;

		span.style.transform = `rotate(${r}deg)`;

		this._widget.appendChild(span);
	}

	return this;
};

EmblemClip.prototype.set = function(options) {
	const {size, text, textFont, textSize, textBold, textColor, duration, delay, easing} = options;

	this.setSize(size);
	this.setText(text);
	this.setTextFont(textFont);
	this.setTextSize(textSize);
	this.setTextBold(textBold);
	this.setTextColor(textColor);

	this.setAnimation(duration, delay, easing);

	return this;
};

EmblemClip.prototype.setValue = function(prop, val) {
	if (prop == 'size')
		this.setSize(val);
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
	else if (prop == 'duration')
		this.setDuration(val);
	else if (prop == 'delay')
		this.setDelay(val);
	else if (prop == 'easing')
		this.setEasing(val);

	return this;
};

EmblemClip.prototype.setSize = function(px) {
	this.setStyle('width', `${px}px`);
	this.setStyle('height', `${px}px`);

	this._width = this._height = px;

	return this;
};

EmblemClip.prototype.setText = function(text) {
	if (text)
		this._draw(text);

	return this;
};

EmblemClip.prototype.setTextFont = function(font) {
	this.addFont(font).setStyle('fontFamily', `"${font}", sans-serif`);

	return this;
};

EmblemClip.prototype.setTextSize = function(px) {
	this.setStyle('fontSize', `${px}px`);

	return this;
};

EmblemClip.prototype.setTextBold = function(bold) {
	this.setStyle('fontWeight', bold ? 'bold' : 'normal');

	return this;
};

EmblemClip.prototype.setTextColor = function(color) {
	this.setStyle('color', color);

	return this;
};

EmblemClip.prototype.setDuration = function(ms) {
	this.setAnimation(ms, this._options.delay, this._options.easing);

	return this;
};

EmblemClip.prototype.setDelay = function(s) {
	this.setAnimation(this._options.duration, s, this._options.easing);

	return this;
};

EmblemClip.prototype.setEasing = function(easing) {
	this.setAnimation(this._options.duration, this._options.delay, easing);

	return this;
};

EmblemClip.prototype.setAnimation = function(duration, delay, easing) {
	const keyframes = [
		{ transform: 'rotate(0deg)' },
		{ transform: 'rotate(360deg)' }
	];

	const options = {
		duration: duration*1000,
		direction: 'alternate',
		iterations: 2,
		easing: easing,
		delay: delay*1000,
		endDelay: 0
	};

	const animations = [
		[this._widget, keyframes, options]
	];

	this.animate(animations, false);

	this._options.duration = duration;
	this._options.delay = delay;
	this._options.easing = easing;

	return this;
};
