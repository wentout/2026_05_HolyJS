import $ from 'jquery';
window.$ = $;
window.runExample = async function (path) {
	const fetched = await fetch(`../2026_05_HolyJS/examples/${path}.js`, {
		headers : {
			'Content-Type' : 'text/plain',
		},
	});
	const src = await fetched.text();
	eval(src);
};
window.openExample = async function (name) {
	const path = `../2026_05_HolyJS/ex_html/${name}.html`;
	window.open(path);
};
