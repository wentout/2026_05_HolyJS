// import './index.css'
import './styles.css';

import { define, defaultTypes } from 'mnemonica';

// Import models to register List type with mnemonica
import './models';

import { Slide, Title, Starter, MDX, Footer, Progressor } from './components';

import Keys from './keyboard';

import Main from './runner';

import postHook from './postCreation';

defaultTypes.registerHook('postCreation', postHook);

 
const Runner = define(Main as any);

 
const SlideRoot = Runner.define(Slide as any);

SlideRoot.define(Title as any);

 
const SlideStarter = SlideRoot.define(Starter as any);
SlideStarter.define(Progressor as any);
SlideStarter.define(Footer as any);

 
const SlideMDX = SlideRoot.define(MDX as any);
SlideMDX.define(Progressor as any);
SlideMDX.define(Footer as any);

 
const app = new Runner('root') as unknown as {
	setErrored(...args: unknown[]): void;
	init(): Promise<unknown>;
	start(): void;
	print?: boolean;
};
// // const app = new App('root');

window.onerror = function (...args) {
	// debugger;
	app.setErrored(...args);
};

app.init()
	.then(() => app.start())
	.then(() => {
		if (app.print) return;
		Keys.call(app);
		// new app.Keys();
	});