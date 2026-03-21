// if you look at the code for a long time, then the code starts to peer at you

// types vs interface - 

// In TypeScript, there's a subtle difference between types and interfaces
// they look the same structurally, but are different ideologically


// POJO
const someObject = {
    name: 'myType',
    createdAt: new Date()
}

Object.setPrototypeOf(someObject, {
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

// POJO
const myInstance = new Interface('MyInterface');

console.log(someObject.describe());
console.log(myInstance.describe());

debugger;

// Interface describes Algorythm,
// Type describes Structure