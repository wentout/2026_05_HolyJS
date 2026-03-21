// types vs interface - If you look at the code for a long time, then the code starts to peer at you

// In TypeScript, there's a subtle difference between types and interfaces
// This example shows nominal typing vs structural typing


// They look the same structurally, but are different nominally
const myType = {
    name: 'myType',
    createdAt: new Date()
}

Object.setPrototypeOf(myType, {
    describe () {
        return `Type ${this.name} created at ${this.createdAt}`;
    }
});

function Interface(name) {
    this.name = name;
    this.createdAt = new Date();
}

Interface.prototype.describe = function() {
    return `Interface ${this.name} created at ${this.createdAt}`;
};

const myInterface = new Interface('MyInterface');

console.log(myType.describe());
console.log(myInterface.describe());

debugger;