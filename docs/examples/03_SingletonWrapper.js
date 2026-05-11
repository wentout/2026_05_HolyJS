
const SingletonWrapper = function () { };

SingletonWrapper.prototype = Object.create(window.$);

SingletonWrapper.prototype.constructor = SingletonWrapper;

const instance = new SingletonWrapper;

debugger;

console.log('instance : ', instance);

debugger;

console.log('typeof instance.isReady : ', typeof instance.isReady);

debugger;
