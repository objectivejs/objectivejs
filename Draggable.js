/**
 *
 * @copyright  2021 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function Draggable() {
	View.call(this);

	this._draggable = false;
	this._dragged = false;
}

Draggable.prototype = Object.create(View.prototype);

Object.defineProperty(Draggable.prototype, 'constructor', { value: Draggable, enumerable: false, writable: true });

Draggable.prototype.isDraggable = function() {
	return this._draggable;
};

Draggable.prototype.enableDrag = function() {
	if (this._draggable)
		return this;

	if (!this.isManaged())
		return this;

	if (this._drag === undefined) {
		let xmax, ymax;
		let x0, y0;

		this._drag = (e) => {
			let x1, y1;

			switch (e.type) {
				case 'mousemove':
					x1 = Math.max(e.clientX, 0);
					y1 = Math.max(e.clientY, 0);
					break;

				case 'touchmove':
					x1 = Math.max(e.changedTouches[0].clientX, 0);
					y1 = Math.max(e.changedTouches[0].clientY, 0);
					break;

				default:
					return;
			}

			const dx = x0 - x1;
			const dy = y0 - y1;

			if (dx == 0 && dy == 0)
				return;

			x0 = x1;
			y0 = y1;

			const w = this._widget;

			const x = Math.max(0, Math.min(xmax, w.offsetLeft - dx));
			const y = Math.max(0, Math.min(ymax, w.offsetTop - dy));

			w.style.left = x + 'px';
			w.style.top = y + 'px';

			this._dragged = true;
		};

		this._startdrag = (e) => {
			switch (e.type) {
				case 'mousedown':
					x0 = e.clientX;
					y0 = e.clientY;

					document.addEventListener('mousemove', this._drag);
					document.addEventListener('mouseup', this._stopdrag);

					e.preventDefault();
					break;

				case 'touchstart':
					x0 = e.touches[0].clientX;
					y0 = e.touches[0].clientY;

					document.addEventListener('touchmove', this._drag);
					document.addEventListener('touchend', this._stopdrag);
					break;

				default:
					return;
			}

			this._dragged = false;
		};

		this._stopdrag = (e) => {
			switch (e.type) {
				case 'mouseup':
					document.removeEventListener('mousemove', this._drag);
					document.removeEventListener('mouseup', this._stopdrag);

					e.preventDefault();
					break;

				case 'touchend':
					document.removeEventListener('touchmove', this._drag);
					document.removeEventListener('touchend', this._stopdrag);
					break;

				default:
					return;
			}
		};

		this._fitin = () => {
			const w = this._widget;
			const cw = this._parent;

			xmax = cw.offsetWidth - w.width;
			ymax = cw.offsetHeight - w.height;

			const x = Math.max(0, Math.min(xmax, w.offsetLeft));
			const y = Math.max(0, Math.min(ymax, w.offsetTop));

			if (x != w.offsetLeft || y != w.offsetTop) {
				w.style.left = x + 'px';
				w.style.top = y + 'px';
			}
		};

		this._dragobserver = new ResizeObserver(this._fitin);
	}

	this._parent.style.position = 'relative';

	this._dragobserver.observe(this._parent);

	this.addEventListener('mousedown', this._startdrag);
	this.addEventListener('touchstart', this._startdrag);

	this.setStyle('position', 'absolute');

	this.setStyle('touchAction', 'none');

	this._draggable = true;
	this._dragged = false;

	return this;
};

Draggable.prototype.disableDrag = function() {
	if (!this._draggable)
		return this;

	this._dragobserver.unobserve(this._parent);

	this.removeEventListener('touchstart', this._startdrag);
	this.removeEventListener('mousedown', this._startdrag);

	this.setStyle('touchAction', 'auto');

	this._draggable = false;
	this._dragged = false;

	return this;
};
