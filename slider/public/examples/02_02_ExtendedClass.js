
// prototype introspection

debugger;

class BaseClass {};

class TheClass extends BaseClass{};

debugger;

const instance = new TheClass;

debugger;

console.log('Object.getPrototypeOf(TheClass) : ', Object.getPrototypeOf(TheClass));

debugger;

console.log('Object.getPrototypeOf(TheClass.prototype) : ', Object.getPrototypeOf(TheClass.prototype));

debugger;

console.log('Object.getPrototypeOf(TheClass) === BaseClass : ', Object.getPrototypeOf(TheClass) === BaseClass);

debugger;

console.log('Object.getPrototypeOf(TheClass.prototype) === BaseClass.prototype : ', Object.getPrototypeOf(TheClass.prototype) === BaseClass.prototype);

debugger;