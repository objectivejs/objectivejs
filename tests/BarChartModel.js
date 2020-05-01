/**
 *
 * @copyright  2020 objectivejs.org
 * @version    1
 * @link       http://www.objectivejs.org
 */

"use strict";

function BarChartModel(chartname) {
	Model.call(this, chartname);

	this._value = {
		data: null, layout:	{ title: '', legend: false }
	};
}

BarChartModel.prototype = Object.create(Model.prototype);

Object.defineProperty(BarChartModel.prototype, 'constructor', { value: BarChartModel, enumerable: false, writable: true });

BarChartModel.prototype.validateValue = function(prop, val) {
	if (prop == 'data')
		return val === null || Array.isArray(val);

	if (prop == 'layout') {
		if (typeof val !== 'object')
			return false;

		const { title, legend } = val;

		if (typeof title !== 'string')
			return false;

		if (typeof legend !== 'boolean')
			return false;

		return true;
	}

	return true;
}
