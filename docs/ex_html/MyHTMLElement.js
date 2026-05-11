
const { HTMLElement } = window;

class MyHTMLElement extends HTMLElement {

    communicate(value) {
        this.innerHTML = `${this.protoAddition} + ${this.addition} + ${value}`;
    }

    addition = 'addition';

}

const protoProps = {
    protoAddition: 'protoAddition',
};
Object.setPrototypeOf(protoProps, HTMLElement.prototype);

const proxy = new Proxy(protoProps, {
    get(target, prop, receiver) {
        const result = Reflect.get(target, prop, receiver);
        console.log('get:', prop, result);
        return result;
    },
    set(target, prop, value, receiver) {
        const result = Reflect.set(target, prop, value, receiver);
        console.log('set:', prop, result, value);
        return result;
    },
});


Object.setPrototypeOf(MyHTMLElement.prototype, proxy);

customElements.define('my-custom-element', MyHTMLElement);
const myElement = document.createElement('my-custom-element');

console.log('myElement instanceof MyHTMLElement',
    myElement instanceof MyHTMLElement);
console.log('myElement instanceof HTMLElement',
    myElement instanceof HTMLElement);

console.log('render begins');
myElement.innerText = 123;          // set  
const renderBox = document.getElementById('some');
renderBox.appendChild(myElement);
console.log('render finish');

myElement.communicate('message');

console.log(myElement.innerText);   // get