// types vs interface - If you look at the code for a long time, then the code starts to peer at you

// In TypeScript, there's a subtle difference between types and interfaces
// This example shows nominal typing vs structural typing

function Type(name) {
    this.name = name;
    this.createdAt = new Date();
}

Type.prototype.describe = function() {
    return `Type ${this.name} created at ${this.createdAt}`;
};

function Interface(name) {
    this.name = name;
    this.createdAt = new Date();
}

Interface.prototype.describe = function() {
    return `Interface ${this.name} created at ${this.createdAt}`;
};

// They look the same structurally, but are different nominally
const myType = new Type('MyType');
const myInterface = new Interface('MyInterface');

console.log(myType.describe());
console.log(myInterface.describe());

// The constructor name is what makes them different
console.log('Type check:', myType.constructor.name);
console.log('Interface check:', myInterface.constructor.name);

// This is the essence of nominal vs structural typing
console.log('Are they the same?', myType.constructor === myInterface.constructor);
