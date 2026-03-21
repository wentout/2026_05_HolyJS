// Forkable pattern - prototype chain sharing

function Forkable() {
    // constructor
}

Object.defineProperty(Forkable.prototype, 'fork', {
    get() {
        const me = this;
        return function(...args) {
            if (new.target) {
                return new me.constructor(...args);
            }
            return me.constructor.call(this, ...args);
        };
    }
});

const instance = new Forkable();
const forked = new instance.fork();

console.log('instance:', instance);
console.log('forked:', forked);
console.log('Both share the same prototype chain:', instance.constructor === forked.constructor);
