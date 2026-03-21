// 1. having strict names for Constructors
const MyConstructorSymbol = Symbol('My Constructor');

const MyConstructor = function () {
    Reflect.defineProperty(this, 'tesingTheName', {
        get () {
            return this.constructor.name;
        }
    });
};

Reflect.defineProperty(MyConstructor, 'name', {
	get() {
		return MyConstructorSymbol;
	}
});

Object.freeze(MyConstructor.prototype.constructor);

console.log(1, MyConstructor.name);     // Symbol(My Constructor)
delete MyConstructor.name;
console.log(2, MyConstructor.name);     // Symbol(My Constructor)

// 2. making IoC store
const ConstructorsIoC = new Map();
ConstructorsIoC.set(MyConstructorSymbol, MyConstructor);

// 3. getting the constructor instance from IoC
const myInstance = new (ConstructorsIoC.get(MyConstructorSymbol));

console.log(myInstance.tesingTheName);              // Symbol(My Constructor)
console.log(myInstance instanceof MyConstructor);   // trye

// so we have full functionality covered here
