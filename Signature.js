/**
 *
 * @copyright  2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function Signature(options = false) {
	options = options || {};

	let lineColor = options.lineColor;
	let lineWidth = options.lineWidth;

	if (lineColor === undefined)
		lineColor = Signature.defaultLineColor;
	else if (!Validator.validateColor(lineColor))
		throw new TypeError();

	if (lineWidth === undefined)
		lineWidth = Signature.defaultLineWidth;
	else if (typeof lineWidth !== 'number')
		throw new TypeError();

	View.call(this);

	this._lineColor = lineColor;
	this._lineWidth = lineWidth;
}

Signature.prototype = Object.create(View.prototype);

Object.defineProperty(Signature.prototype, 'constructor', { value: Signature, enumerable: false, writable: true });

Signature.defaultLineColor = '#000000';
Signature.defaultLineWidth = 5;

Signature.prototype.erase = function() {
	if (this._widget) {
    	this._widget.getContext('2d').clearRect(0, 0, this._widget.width, this._widget.height);
	}

	return this;
};

Signature.prototype.setWidget = function(w) {
	if (w.tagName != 'CANVAS')
		throw new TypeError();

	View.prototype.setWidget.call(this, w);

	const ctx = w.getContext('2d');

	ctx.strokeStyle = this._lineColor;
	ctx.lineWidth = this._lineWidth;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	w.style.touchAction = 'none';

	let x0 = 0;
	let y0 = 0;

	function _stroke(e) {
		if (e.type === 'mousemove' || e.type === 'touchmove')
			return;

		let x = e.offsetX * (w.width / w.clientWidth);
	    let y = e.offsetY * (w.height / w.clientHeight);

		if (x0 && y0) {
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.lineTo(x, y);
			ctx.stroke();
			ctx.closePath();
		}

		x0 = x;
		y0 = y;
	}

	w.addEventListener('mousedown', () => {
	    if (event.which === 1)
	    	w.addEventListener('mousemove', _stroke, false);
	}, false);

	w.addEventListener('mouseup', () => {
		if (event.which === 1)
			w.removeEventListener('mousemove', _stroke, false), x0 = y0 = 0;
	}, false);

	w.addEventListener('pointerdown', () => {
    	w.addEventListener('pointermove', _stroke, false);
	}, false);

	w.addEventListener('pointerup', () => {
		w.removeEventListener('pointermove', _stroke, false), x0 = y0 = 0;
	}, false);

	w.addEventListener('touchstart', (e) => {
	    e.preventDefault();

	    if (e.targetTouches.length === 1)
	    	w.addEventListener('touchmove', _stroke, false);
	}, false);

	w.addEventListener('touchend', (e) => {
	    e.preventDefault();

    	w.removeEventListener('touchmove', _stroke, false), x0 = y0 = 0;
	}, false);

	return this;
};
