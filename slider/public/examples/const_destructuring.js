'use strict';

debugger;

let toBeProp = 5;

const myObject = {};
Object.defineProperty(myObject, 'prop', {
	get () {
		return {
			[Symbol.toPrimitive] () {
				return toBeProp;
			}
		};
	},
	enumerable: true,
});

// const or let ???
const { prop: prop1 } = myObject;
let { prop: prop2 } = myObject;

console.log('prop1 + 0 : ', prop1 + 0);			// 5
console.log('prop2 + 0 : ', prop2 + 0);			// 5

toBeProp = 7;

console.log('prop1 + 0 : ', prop1 + 0);			// 7
console.log('prop2 + 0 : ', prop2 + 0);			// 7

prop2 = 3;

console.log('prop1 + 0 : ', prop1 + 0);			// 7
console.log('prop2 + 0 : ', prop2 + 0);			// 3

console.log('myObject.prop + 0 : ', myObject.prop + 0);		// 7

debugger;
