/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
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

	// Touch / swipe support for mobile
	let touchStartX = 0;
	let touchStartY = 0;
	const swipeThreshold = 50;

	window.document.addEventListener('touchstart', (e) => {
		touchStartX = e.changedTouches[ 0 ].screenX;
		touchStartY = e.changedTouches[ 0 ].screenY;
	}, { passive : true });

	window.document.addEventListener('touchend', (e) => {
		const touchEndX = e.changedTouches[ 0 ].screenX;
		const touchEndY = e.changedTouches[ 0 ].screenY;
		const dx = touchEndX - touchStartX;
		const dy = touchEndY - touchStartY;

		// Horizontal swipe
		if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > swipeThreshold) {
			if (dx < 0) {
				w(() => app.slideNext())();
			} else {
				w(() => app.slidePrev())();
			}
		}
	}, { passive : true });

	// Tap on screen halves
	window.document.addEventListener('click', (e) => {
		const width = window.innerWidth;
		const x = e.clientX;
		if (x > width * 0.7) {
			w(() => app.slideNext())();
		} else if (x < width * 0.3) {
			w(() => app.slidePrev())();
		}
	});

}