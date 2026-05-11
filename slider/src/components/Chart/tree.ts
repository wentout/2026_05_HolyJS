import * as d3 from 'd3';

type TreeNode = d3.HierarchyNode<any> & {
	x0?: number;
	y0?: number;
	id?: string | number;
	_children?: TreeNode[] | null;
};

type TreeLink = {
	source: TreeNode;
	target: TreeNode;
};

const tree = function ({
	chartData,
	dy,
	dx,
	margin,
	width,
	stash,

	printer
	// tree,
	// diagonal
}) {

	const root = d3.hierarchy(chartData) as unknown as TreeNode;

	const treeMaker = d3
		.tree()
		.nodeSize([ dy, dx ]);
	const diagonal = d3
		.linkHorizontal()
		.x((d: any) => d.y)
		.y((d: any) => d.x);

	(root as any).x0 = dy;
	(root as any).y0 = 0;
	root.descendants().forEach((d: any, i: number) => {
		d.id = i;
		d._children = d.children;
		if (printer) {
			return;
		}
		if (d.depth && stash && stash.includes(d.data.name)) {
			d.children = null;
		}
	});

	const svg = d3.create('svg')
		.attr('viewBox', [ -margin.left, -margin.top, width, dx ])
		.style('font', '10px sans-serif')
		.style('user-select', 'none');

	const gLink = svg.append('g')
		.attr('fill', 'none')
		.attr('stroke', '#555')
		.attr('stroke-opacity', 0.4)
		.attr('stroke-width', 1.5);

	const gNode = svg.append('g')
		.attr('cursor', 'pointer')
		.attr('pointer-events', 'all');

	function update (source: TreeNode) {

		const duration = 250;
		const nodes = root.descendants().reverse();
		const links = root.links() as unknown as TreeLink[];

		// Compute the new tree layout.
		treeMaker(root as any);

		let left = root;
		let right = root;
		root.eachBefore((nodeEl: any) => {
			if (nodeEl.x < left.x) left = nodeEl;
			if (nodeEl.x > right.x) right = nodeEl;
		});

		const height = right.x - left.x + margin.top + margin.bottom;

		const transition = svg.transition()
			.duration(duration)
			.attr('viewBox', [ -margin.left, left.x - margin.top, width, height ] as any)
			.tween('resize', window.ResizeObserver ? null : () => () => svg.dispatch('toggle'));

		// Update the nodes…
		const node = gNode.selectAll('g').data(nodes, (d: any) => d.id);

		// Enter any new nodes at the parent's previous position.
		const nodeEnter = node.enter().append('g')
			.attr('transform', (/*d*/) => `translate(${source.y0},${source.x0})`)
			.attr('fill-opacity', 10)
			.attr('stroke-opacity', 10)
			.on('click', (_event: any, d: TreeNode) => {
				// debugger;
				if ((d as any)._children) {
					d.children = d.children ? null : (d as any)._children;
				} else {
					const pc = (d.parent as any).children.filter((child: any) => child !== d);
					(d.parent as any).children = pc.length ? pc : null;
				}
				update(d);
			});

		nodeEnter.append('circle')
			.attr('r', 7)
			.attr('fill', (d: any) => (d._children ? '#555' : '#999'))
			.attr('stroke-width', 25);

		nodeEnter.append('text')
			.attr('dy', '0.41em')
			.attr('x', (d: any) => (d._children ? -9 : 9))
			.attr('text-anchor', (d: any) => (d._children ? 'end' : 'start'))
			.text((d: any) => d.data.name)
			.clone(true)
			.lower()
			.attr('stroke-linejoin', 'round')
			.attr('stroke-width', 2)
			.attr('stroke', (d: any) => d.data.stroke || 'white');

		// Transition nodes to their new position.
		// const nodeUpdate =
		node.merge(nodeEnter).transition(transition)
			.attr('transform', (d: any) => `translate(${d.y},${d.x})`)
			.attr('fill-opacity', 100)
			.attr('stroke-opacity', 1);

		// Transition exiting nodes to the parent's new position.
		// const nodeExit =
		node
			.exit()
			.transition(transition)
			.remove()
			.attr('transform', (/*d*/) => `translate(${source.y},${source.x})`)
			.attr('fill-opacity', 0)
			.attr('stroke-opacity', 0);

		// Update the links…
		const link = gLink.selectAll('path').data(links, (d: any) => d.target.id);

		// Enter any new links at the parent's previous position.
		const linkEnter = link.enter().append('path')
			.attr('d', (/*d*/) => {
				const o = { x : source.x0, y : source.y0 };
				return diagonal({ source : o, target : o } as any);
			});

		// Transition links to their new position.
		link.merge(linkEnter).transition(transition)
			.attr('d', diagonal as any);

		// Transition exiting nodes to the parent's new position.
		link.exit().transition(transition)
			.remove()
			.attr('d', (/*d*/) => {
				const o = { x : source.x, y : source.y };
				return diagonal({ source : o, target : o } as any);
			});

		// Stash the old positions for transition.
		root.eachBefore((d: any) => {
			d.x0 = d.x;
			d.y0 = d.y;
		});
	}

	update(root);

	return svg.node();
};

export default tree;