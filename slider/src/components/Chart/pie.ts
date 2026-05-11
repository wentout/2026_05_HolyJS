import * as d3 from 'd3';

interface PieDatum {
	value: number;
	name: string;
	fill?: string;
}

const pie = function ({ chartData, width, height, fontSize }) {

	const {
		data
	} = chartData;

	const pied = d3
		.pie<PieDatum>()
		.sort(null)
		.value(d => d.value);

	const color = d3.scaleOrdinal<string, string>()
		.domain(data.map((d: PieDatum) => d.name))
		.range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

	const arc = d3.arc<d3.PieArcDatum<PieDatum>>()
		.innerRadius(0)
		.outerRadius(Math.min(width, height) / 2 - 1);

	const arcLabel = (() => {
		const radius = Math.min(width, height) / 2 * 0.8;
		return d3
			.arc<d3.PieArcDatum<PieDatum>>()
			.innerRadius(radius)
			.outerRadius(radius);
	})();

	const arcs = pied(data as PieDatum[]);

	const svg = d3.create('svg')
		.attr('viewBox', [ -width / 2, -height / 2, width, height ]);

	svg.append('g')
		.attr('stroke', 'white')
		.selectAll('path')
		.data(arcs)
		.join('path')
		.attr('fill', (d: d3.PieArcDatum<PieDatum>) => {
			return d.data.fill || color(d.data.name);
		})
		.attr('d', arc)
		.append('title')
		.text((d: d3.PieArcDatum<PieDatum>) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

	svg.append('g')
		.attr('font-family', 'sans-serif')
		.attr('font-size', fontSize)
		.attr('text-anchor', 'middle')
		.selectAll('text')
		.data(arcs)
		.join('text')
		.attr('transform', (d: d3.PieArcDatum<PieDatum>) => `translate(${arcLabel.centroid(d)})`)
		.call(text => text.append('tspan')
			.attr('y', '-0.4em')
			.attr('font-weight', 'bold')
			.text((d: d3.PieArcDatum<PieDatum>) => d.data.name))
		.call(text => text.filter((d: d3.PieArcDatum<PieDatum>) => (d.endAngle - d.startAngle) > 0.25).append('tspan')
			.attr('x', 0)
			.attr('y', '1em')
			.attr('fill-opacity', 0.7)
			.text((d: d3.PieArcDatum<PieDatum>) => d.data.value.toLocaleString()));

	return svg.node();

};

export default pie;