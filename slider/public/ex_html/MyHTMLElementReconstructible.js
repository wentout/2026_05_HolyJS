'use strict';

const ogp = Object.getPrototypeOf;
const ohp = Object.prototype.hasOwnProperty;

// Detects DOM accessors (getters/setters) and methods that need
// a real DOM element as `this`. Plain data properties are fine.
function getDOMDescriptor(prop) {
    if (typeof prop !== 'string') return null;
    let proto = HTMLElement.prototype;
    while (proto) {
        const desc = Object.getOwnPropertyDescriptor(proto, prop);
        if (desc) {
            const isAccessor = !!(desc.get || desc.set);
            const isMethod = typeof desc.value === 'function';
            if (isAccessor || isMethod) return desc;
            return null;
        }
        proto = Object.getPrototypeOf(proto);
    }
    return null;
}

// === Self-Reconstructible HTMLElement Base ===
// Uses the technique from self_reconstruct.js line 8+
const SelfReconstructibleHTMLElement = function() {
    const root = this;
    const main = this.constructor;
    const isItSelf = main === SelfReconstructibleHTMLElement;

    const Self = function() {
        if (new.target) {
            const isSelfInside = this.constructor === Self;
            const isCstrInside = this.constructor === SelfReconstructibleHTMLElement;
            if (!isSelfInside && !isCstrInside) {
                Object.setPrototypeOf(ogp(this), root);
                const ExSelf = SelfReconstructibleHTMLElement.call(this);
                return ExSelf;
            }
            const Constructor = isItSelf ? SelfReconstructibleHTMLElement : main;
            return new Constructor;
        }
        return Self;
    };

    Object.setPrototypeOf(Self, root);
    Self.prototype.constructor = main;

    // Backing real DOM element -- all DOM ops are forwarded here
    Self._element = document.createElement('div');

    return Self;
};

// Chain prototype with HTMLElement so instanceof HTMLElement works.
// Note: instanceof Function will be false because HTMLElement.prototype
// and Function.prototype are on separate prototype branches.
Object.setPrototypeOf(SelfReconstructibleHTMLElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(SelfReconstructibleHTMLElement, HTMLElement);

// === Proxy Layer (from MyHTMLElement.js) ===
const protoProps = {
    protoAddition: 'protoAddition',
};
Object.setPrototypeOf(protoProps, SelfReconstructibleHTMLElement.prototype);

const proxy = new Proxy(protoProps, {
    get(target, prop, receiver) {
        const domDesc = getDOMDescriptor(prop);
        if (domDesc && receiver && receiver._element) {
            const result = receiver._element[prop];
            // Bind DOM methods so `this` is the real element
            if (typeof result === 'function') {
                const bound = result.bind(receiver._element);
                console.log('get:', prop, bound);
                return bound;
            }
            console.log('get:', prop, result);
            return result;
        }
        const result = Reflect.get(target, prop, receiver);
        console.log('get:', prop, result);
        return result;
    },
    set(target, prop, value, receiver) {
        const domDesc = getDOMDescriptor(prop);
        if (domDesc && domDesc.set && receiver && receiver._element) {
            receiver._element[prop] = value;
            console.log('set:', prop, true, value);
            return true;
        }
        const result = Reflect.set(target, prop, value, receiver);
        console.log('set:', prop, result, value);
        return result;
    },
});

// === MyHTMLElement extends the self-reconstructible base ===
class MyHTMLElement extends SelfReconstructibleHTMLElement {
    communicate(value) {
        this.innerHTML = `${this.protoAddition} + ${this.addition} + ${value}`;
    }
}

MyHTMLElement.prototype.addition = 'addition';

Object.setPrototypeOf(MyHTMLElement.prototype, proxy);
Object.setPrototypeOf(MyHTMLElement, SelfReconstructibleHTMLElement);

// === Create instance ===
const myElement = new MyHTMLElement();

console.log('myElement instanceof MyHTMLElement     : ', myElement instanceof MyHTMLElement);
console.log('myElement instanceof HTMLElement       : ', myElement instanceof HTMLElement);
console.log('myElement instanceof Object            : ', myElement instanceof Object);
console.log('myElement instanceof Function          : ', myElement instanceof Function);
console.log('myElement.constructor.name             : ', myElement.constructor.name);

console.log('\n--- proxy features ---');

const renderBox = document.getElementById('some');
renderBox.appendChild(myElement._element);

myElement.innerText = 123;
myElement.communicate('message');
console.log('myElement.innerText                    : ', myElement.innerText);

// === Self-Reconstruction: the key feature ===
console.log('\n--- self reconstruction ---');

const reconstructed = new myElement;
console.log('reconstructed instanceof MyHTMLElement : ', reconstructed instanceof MyHTMLElement);
console.log('reconstructed instanceof HTMLElement   : ', reconstructed instanceof HTMLElement);
console.log('reconstructed instanceof Object        : ', reconstructed instanceof Object);
console.log('reconstructed instanceof Function      : ', reconstructed instanceof Function);
console.log('reconstructed.constructor.name         : ', reconstructed.constructor.name);

reconstructed._element = document.createElement('div');
reconstructed._element.style.border = '2px solid green';
renderBox.appendChild(reconstructed._element);

reconstructed.communicate('reconstructed');

// === Sequential reconstruction ===
console.log('\n--- sequential reconstruction ---');
const seq = new reconstructed;
console.log('seq instanceof MyHTMLElement           : ', seq instanceof MyHTMLElement);
console.log('seq instanceof HTMLElement             : ', seq instanceof HTMLElement);
console.log('seq.constructor.name                   : ', seq.constructor.name);

seq._element = document.createElement('div');
seq._element.style.border = '2px solid orange';
renderBox.appendChild(seq._element);
seq.communicate('sequential');

console.log('\n--- values from proto chain ---');
console.log('myElement.protoAddition                : ', myElement.protoAddition);
console.log('reconstructed.protoAddition            : ', reconstructed.protoAddition);
console.log('seq.protoAddition                      : ', seq.protoAddition);

console.log('\n--- bye ---');
