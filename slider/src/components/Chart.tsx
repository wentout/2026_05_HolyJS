import React from 'react';
import tree from './Chart/tree';
import pie from './Chart/pie';

const charts = {
	tree,
	pie,
};

const chart = function (scope) {

	const children = scope.collectTypes();

	const Chart = function (props) {

		const {
			id,
			opts,
		} = props;

		const {
			chart: chartData
		} = opts;

		const [ _chartData ] = children;
		chartData.chartData = _chartData;
		chartData.print = scope.print;

		const appendSVG = function (chartRoot) {
			const chartSVG = charts[ chartData.type ](chartData);
			if (chartRoot) {
				chartRoot.append(chartSVG);
			}
		};

		return (<div ref={appendSVG} id={id} className='Chart'>{opts.title}</div>);
	};

	return Chart;
};

export default chart;
