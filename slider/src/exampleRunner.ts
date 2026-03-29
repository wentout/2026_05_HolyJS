import $ from 'jquery';
window.$ = $;
window.runExample = async function (path) {
	debugger;
	const fetched = await fetch(`../2026_05_HolyJS/examples/${path}.js`, {
		headers : {
			'Content-Type' : 'text/plain',
		},
	});
	const src = await fetched.text();
	eval(src);
};
