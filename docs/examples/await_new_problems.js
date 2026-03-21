'use strict';

class MyPromise<T> extends Promise<T> {
    constructor(handler: (
        resolve: (value: T) => unknown,
        reject: () => unknown) => void
    ) {
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