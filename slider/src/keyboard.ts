const wrapErrored = function (method) {
	const app = this;
	return function () {
		if (app.errored) {
			window.alert('please press Ctrl + Esc to continue');
		} else {
			method();
		}
	};
};


export default function () {

	const app = this;

	const w = wrapErrored.bind(this);

	const listener = new window.keypress.Listener();

	listener.simple_combo('home', w(() => app.slidePrev()));
	listener.simple_combo('end', w(() => app.slideNext()));
	listener.simple_combo('left', w(() => app.slidePrev()));
	listener.simple_combo('right', w(() => app.slideNext()));
	listener.simple_combo('space', w(() => app.slideNext()));
	listener.simple_combo('ctrl home', w(() => app.setSlideIndex(0)));
	listener.simple_combo('ctrl end', w(() => app.setSlideIndex(-1)));
	listener.simple_combo('ctrl m', w(() => app.requestSlideNav()));
	listener.simple_combo('ctrl esc', () => {
		app.unsetErrored();
	});

	// window.document.onclick = function () {
	// 	app.clickNext();
	// };

}