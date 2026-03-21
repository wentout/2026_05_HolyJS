'use strict';

debugger;

const data = {
	linked: 5
};

class Destination {
	constructor(source) {
		const descriptor = Object
			.getOwnPropertyDescriptor(source, 'linked');
		
		Object.defineProperty(this, 'link', descriptor);
	}
}

class Source {

	constructor(data) {
		// this demonstates no access unless coupled with other object
		// so you may define method for retreiving this checker
		Object.defineProperty(this, 'linked', {
			get () {
				if (!(this instanceof Destination)) throw new Error('Access Denied');
				return data.linked;
			}
		});
		// this is just for example, actually not needed at all
		Object.defineProperty(this, 'thisDataLinkedForExample', {
			get () {
				return data.linked;
			}
		});
	}

}

const source = new Source(data);
const destination = new Destination(source);

console.log('source', source);
console.log('destination', destination);

console.log('source props', Object.getOwnPropertyDescriptors(source));
console.log('destination props', Object.getOwnPropertyDescriptors(destination));

try {
	console.log('\nsource.linked reading error ↓↓↓ ');
	console.log(source.linked);
} catch (error) {
	// process._rawDebug(error); // better use this for node.js
	console.error(error);
}

console.log('\n\n--------\n\n')

console.log('source.thisDataLinkedForExample ↓↓↓ ');
console.log(source.thisDataLinkedForExample);

console.log('wow: destination.link ↓↓↓ ');
console.log(destination.link, ' : is 5');

data.linked = 7;

console.log('wow: destination.link ↓↓↓ ');
console.log(destination.link, ' : is 7');

console.log('source.thisDataLinkedForExample ↓↓↓ ');
console.log(source.thisDataLinkedForExample);
