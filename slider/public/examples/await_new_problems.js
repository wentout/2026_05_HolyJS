'use strict';

debugger;

class MyPromise extends Promise {
    constructor(handler) {
        super(handler);
    }
}

const myItem = new MyPromise((resolve, reject) => {
    resolve(123);
});

console.log('myItem instanceof Promise', myItem instanceof Promise);

(async () => {
    console.log(await myItem);
    console.log(await new MyPromise((resolve) => {
        resolve(321);
    }));
})();