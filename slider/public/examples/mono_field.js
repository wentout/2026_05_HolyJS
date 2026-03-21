
debugger;


let value = 123;

const MyGetSetTestClass = class {
	get get() {
		console.log('g0')
		return function () {
			console.log('g1')
			return ++value;
		}
	}
	set get(value) {
		throw new Error('setter for getter is out of control');
	}
	get set() {
		console.log('s0')
		return function (_value) {
			console.log('s1', _value)
			value = _value;
			return value;
		}
	}
	set set(value) {
		throw new Error('setter for setter is out of understanding');
	}
}

debugger;

const myGetSetField = new MyGetSetTestClass;


const myGetSetTestingObject = {};
const myGetSetTestingObjectSecond = {};
try {
	Reflect.defineProperty(myGetSetTestingObject, 'testMonoField', myGetSetField);
	Reflect.defineProperty(myGetSetTestingObjectSecond, 'testMonoFieldSecond', myGetSetField);
} catch (error) {
	debugger;
	console.error(error);
}


console.log(myGetSetTestingObject.testMonoField);
myGetSetTestingObject.testMonoField = 123;

try {
	console.log('assign to getter');
	myGetSetField.get = 1234;
} catch (error) {
	debugger;
	console.error(error);
}
try {
	console.log('assign to setter');
	myGetSetField.set = 1234;
} catch (error) {
	debugger;
	console.error(error);
}


console.log(myGetSetTestingObject.testMonoField);
myGetSetTestingObjectSecond.testMonoFieldSecond = 12345;

console.log('!!!', myGetSetTestingObject.testMonoField);