/**
 *
 * @copyright  2020 objectivejs.org
 * @version    2
 * @link       http://www.objectivejs.org
 */

"use strict";

function BarChart() {
	View.call(this);

	this._data = null;
	this._layout = null;

	this._plotly = null;
}

BarChart.prototype = Object.create(View.prototype);

Object.defineProperty(BarChart.prototype, 'constructor', { value: BarChart, enumerable: false, writable: true });

BarChart.prototype._draw = function() {
	const config = {
		staticPlot: true,
		responsive: true
	};

	const layout = {
		margin: { l: 30, r: 20, t: 50, b: 40 },
		title: this._layout.title,
		showlegend: this._layout.legend,
		barmode: 'group',
		xaxis: {
			dtick: 1,
			showgrid: false,
			zeroline: false
		},
		yaxis: {
			showgrid: true,
			zeroline: true
		}
	};

	const data = [];

	for (let v of this._data || []) {
		const trace = {};

		trace.type = 'bar';

		trace.name = '';

		trace.x = v.x.match(/-?\d+(\.\d+)?/g);
		trace.y = v.y.match(/-?\d+(\.\d+)?/g);

		trace.marker = {
			color: v.markercolor
		};

		data.push(trace);
	}

	if (this._plotly === null)
		this._plotly = Plotly.newPlot(this._widget, data, layout, config);
	else
		Plotly.react(this._widget, data, layout);

	return this;
};

BarChart.prototype.set = function(options) {
	const {data, layout} = options;

	this._data = data;
	this._layout = layout;

	if (this.interfaced())
		this.resetWidget();

	return this;
};

BarChart.prototype.setValue = function(prop, val) {
	if (prop == 'data')
		this.setData(val);
	else if (prop == 'layout')
		this.setLayout(val);

	return this;
};

BarChart.prototype.setData = function(data) {
	this._data = data;

	if (this.interfaced())
		this.resetWidget();

	return this;
};

BarChart.prototype.setLayout = function(layout) {
	this._layout = layout;

	if (this.interfaced())
		this.resetWidget();

	return this;
};

BarChart.prototype.resetWidget = function() {
	this._draw();

	return this;
};

BarChart.prototype.createWidget = function() {
	const graphdiv = '<div></div>';

	let template = document.createElement('template');

	template.innerHTML = graphdiv;

	let widget = template.content.children[0];

	this.setWidget(widget);

	return this;
};

BarChart.prototype.destroyWidget = function() {
	if (this._widget)
		Plotly.purge(this._widget);

	View.prototype.destroyWidget.call(this);

	this._plotly = null;

	return this;
};
