# Self-Reconstructible HTMLElement with Proxy Interception

## Comprehensive Breakdown of the Solution

This document explains every technique, pattern, and line of code used in `MyHTMLElementReconstructible.js`, and recounts the step-by-step process of how the solution was crafted — including the bugs encountered, the limitations discovered, and how each was resolved.

---

## Table of Contents

1. [The Core Challenge](#the-core-challenge)
2. [The Self-Reconstruct Pattern (from `self_reconstruct.js`)](#the-self-reconstruct-pattern)
3. [The Proxy + HTMLElement Pattern (from `MyHTMLElement.js`)](#the-proxy--htmlelement-pattern)
4. [Step-by-Step Construction History](#step-by-step-construction-history)
5. [Line-by-Line Explanation](#line-by-line-explanation)
6. [Bugs, Fixes, and Limitations](#bugs-fixes-and-limitations)
7. [Final Architecture](#final-architecture)

---

## The Core Challenge

The user had two existing pieces of code:

1. **`self_reconstruct.js`** — A brilliant prototype-composition technique where a constructor returns a nested function `Self`. This `Self` is both callable and `new`-able. When you do `new myElement` on an existing instance, it creates a fresh clone that preserves prototype chain relationships.

2. **`MyHTMLElement.js`** — A custom `HTMLElement` subclass that uses a `Proxy` on the prototype chain to intercept `get`/`set` operations, enabling property access logging.

**The goal:** Combine these two techniques so that `new myElement` (self-reconstruction) works on a custom HTMLElement, **while keeping the proxy logging features intact**.

This is difficult because:
- Self-reconstruct instances are **functions**, not DOM elements.
- DOM accessors (`innerText`, `innerHTML`) do internal brand checks and throw "Illegal invocation" when called on a function.
- `HTMLElement.prototype` and `Function.prototype` are on **separate prototype branches**, so `instanceof Function` and `instanceof HTMLElement` are mutually exclusive.
- Class fields are not re-initialized during reconstruction because the class constructor is not re-entered.

---

## The Self-Reconstruct Pattern

From `self_reconstruct.js`, the key insight is on lines 8-68:

```javascript
const Cstr = function () {
    const root = this;
    const main = this.constructor;
    const isItSelf = main === Cstr;

    const Self = function () {
        if (new.target) {
            const isSelfInside = this.constructor === Self;
            const isCstrInside = this.constructor === Cstr;
            if (!isSelfInside && !isCstrInside) {
                // Extended class constructor called us via super()
                Object.setPrototypeOf(ogp(this), root);
                const ExSelf = Cstr.call(this);
                return ExSelf;
            }
            const Constructor = isItSelf ? Cstr : main;
            return new Constructor;
        }
        return Self;
    };

    Object.setPrototypeOf(Self, root);
    Self.prototype.constructor = root;
    Self.value++;
    return Self;
};

Object.setPrototypeOf(Cstr.prototype, Cstr); // instanceof Function
Cstr.prototype.value = 0;
```

### How it works:

1. **`Cstr` is called as a constructor** (`new Cstr()`). Inside, `this` is the newly created object.
2. **`Self` is a nested function** that closes over `root` (the original `this`).
3. **`Object.setPrototypeOf(Self, root)`** — This makes `Self`'s prototype the original instance. This is the magic that makes `reconstructed instanceof myElement` work later.
4. **`Self.prototype.constructor = root`** — Sets the constructor reference so `instanceof` checks work correctly.
5. **`return Self`** — The constructor returns a function object. This is valid in JS: a constructor can return any object.
6. **`new item`** — When you call `new` on the returned `Self`, `new.target` is truthy. The checks determine:
   - `isSelfInside`: `this.constructor === Self` — the Self called itself (should not happen normally).
   - `isCstrInside`: `this.constructor === Cstr` — direct call from Cstr.
   - If NEITHER, we're inside an **extended class constructor** (e.g., `class MyClass extends Cstr { constructor() { super(); } }`). In this case:
     - `Object.setPrototypeOf(ogp(this), root)` fixes the prototype chain that `super()` broke.
     - Then recurse with `Cstr.call(this)`.
   - Otherwise, create a fresh instance: `new Constructor`.

### Why `instanceof` works across reconstructions:

The prototype chain looks like this for `item = new Cstr()`:
```
item (Self function)
  → prototype: { constructor: Cstr }
  → [[Prototype]]: root (the original this from Cstr call)
    → [[Prototype]]: Cstr.prototype (has value: 0)
      → [[Prototype]]: Cstr (the function itself!)
        → [[Prototype]]: Function.prototype
          → [[Prototype]]: Object.prototype
            → null
```

Because `Cstr.prototype`'s prototype is `Cstr` itself (`Object.setPrototypeOf(Cstr.prototype, Cstr)`), `item instanceof Function` is `true`.

When `re = new item`:
```
re (new Self)
  → prototype: { constructor: item }
  → [[Prototype]]: item
    → ... (same chain as above)
```

So `re instanceof Cstr` is `true` because `Cstr` is in the chain.

---

## The Proxy + HTMLElement Pattern

From `MyHTMLElement.js`:

```javascript
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
```

### How it works:

1. `protoProps` is a plain object with `protoAddition`.
2. Its prototype is `HTMLElement.prototype`, so property lookups fall through to DOM methods.
3. `new Proxy(protoProps, {...})` intercepts ALL property accesses.
4. `MyHTMLElement.prototype`'s prototype is set to this proxy.
5. When `myElement.innerText` is accessed, the proxy logs it.

**Critical issue:** The proxy intercepts `innerText`, which is a DOM accessor (getter/setter on `HTMLElement.prototype`). When the proxy's `get` trap returns the getter function, and then you call `myElement.innerText = 123`, the setter runs with `myElement` as `this`. But `myElement` is NOT a real DOM element — it's a function (from self-reconstruct) or a custom class instance. DOM setters do an internal brand check and throw `TypeError: Illegal invocation`.

---

## Step-by-Step Construction History

### Step 1: Naive Combination (Failed)

**First attempt:** Simply make `SelfReconstructibleHTMLElement` extend `HTMLElement` and put the proxy above it.

```javascript
class MyHTMLElement extends SelfReconstructibleHTMLElement {
    addition = 'addition';
}
Object.setPrototypeOf(MyHTMLElement.prototype, proxy);
```

**Bug 1: Illegal Invocation**
- `myElement.innerText = 123` threw `TypeError: Illegal invocation`.
- **Why:** The proxy returned `HTMLElement.prototype.innerText` setter. When called with `myElement` (a function, not a DOM node), the browser's C++ code rejects it.

### Step 2: Add DOM Forwarding Proxy

**Fix:** Detect DOM accessors/methods and forward them to a real backing DOM element.

```javascript
function getDOMDescriptor(prop) {
    let proto = HTMLElement.prototype;
    while (proto) {
        const desc = Object.getOwnPropertyDescriptor(proto, prop);
        if (desc) {
            if (desc.get || desc.set || typeof desc.value === 'function') {
                return desc;
            }
            return null;
        }
        proto = Object.getPrototypeOf(proto);
    }
    return null;
}
```

In the proxy traps:
- If `prop` is a DOM accessor or method, and the receiver has `_element`, forward to `receiver._element`.
- For methods, bind them to the real element so `this` is correct.

**Result:** `innerText`, `innerHTML`, `appendChild`, etc. now work and are logged.

### Step 3: Instanceof Function is False (Design Limitation)

**Observation:** `myElement instanceof Function` is `false`.

**Why:** In `self_reconstruct.js`, `Object.setPrototypeOf(Cstr.prototype, Cstr)` makes instances `instanceof Function`. But here, we need `instanceof HTMLElement`, which requires `SelfReconstructibleHTMLElement.prototype` to chain to `HTMLElement.prototype`. These are on **different branches** of the prototype tree:

```
Function.prototype
  → Cstr.prototype (if we set it)
    → ...

HTMLElement.prototype
  → Element.prototype
    → Node.prototype
      → EventTarget.prototype
        → Object.prototype
```

You cannot put both `Function.prototype` and `HTMLElement.prototype` in one chain without modifying global prototypes.

**Decision:** Accept this limitation. `instanceof Function` is `false`, but reconstruction still works because `Self` is a callable function regardless.

### Step 4: Addition is Undefined on Reconstructed (Bug)

**Bug:** Reconstructed instances showed `protoAddition + undefined + reconstructed`.

**Why:** `addition` was a class field:
```javascript
class MyHTMLElement extends SelfReconstructibleHTMLElement {
    addition = 'addition';  // Class field
}
```

Class fields are initialized in the class constructor body. But during reconstruction, `SelfReconstructibleHTMLElement.call(this)` creates a bare `Self` function — it never re-enters `MyHTMLElement`'s constructor, so class fields are NOT re-initialized.

**Fix:** Move `addition` to the prototype:
```javascript
MyHTMLElement.prototype.addition = 'addition';
```

Now all instances (original and reconstructed) inherit it from the prototype.

### Step 5: Constructor Name is Undefined (Bug)

**Bug:** `reconstructed.constructor.name` was `undefined`.

**Why:** In the original `self_reconstruct.js`:
```javascript
Self.prototype.constructor = root;
```

`root` is the instance object from the `Cstr` call. Instance objects don't have a `.name` property (only functions do). So `root.name` is `undefined`.

**Fix:** Use `main` instead of `root`:
```javascript
Self.prototype.constructor = main;
```

`main` is `this.constructor`, which is the actual class/function (`MyHTMLElement`), so `main.name` is `"MyHTMLElement"`.

### Step 6: Sequential Reconstruction

After all fixes, `new reconstructed` and `new seq` work correctly, preserving:
- `instanceof MyHTMLElement`
- `instanceof HTMLElement`
- `constructor.name`
- Proxy logging
- DOM forwarding

---

## Line-by-Line Explanation

### `getDOMDescriptor(prop)` (lines 8-22)

Walks the prototype chain from `HTMLElement.prototype` up to `Object.prototype`, looking for property descriptors. Returns the descriptor only if it's an accessor (getter/setter) or a method. Returns `null` for plain data properties.

**Why:** Plain data properties can be stored on the instance or proxy target directly. Only DOM accessors and methods need special forwarding because they require a real DOM `this`.

### `SelfReconstructibleHTMLElement` constructor (lines 26-53)

This is the adapted `Cstr` from `self_reconstruct.js`:

- **Line 27 `const root = this`**: Captures the instance being constructed.
- **Line 28 `const main = this.constructor`**: The actual class (e.g., `MyHTMLElement`).
- **Line 29 `const isItSelf = main === SelfReconstructibleHTMLElement`**: Are we being called directly, or via extension?
- **Lines 31-44 `Self` function**: The nested reconstructible function.
  - **Line 32 `if (new.target)`**: Was this called with `new`?
  - **Lines 33-34**: Check if we're inside `Self` or `SelfReconstructibleHTMLElement` directly.
  - **Line 35 `if (!isSelfInside && !isCstrInside)`**: We're inside an extended class constructor.
    - **Line 36 `Object.setPrototypeOf(ogp(this), root)`**: Fix the prototype chain.
    - **Line 37 `SelfReconstructibleHTMLElement.call(this)`**: Recurse to create the actual `Self`.
  - **Line 40 `const Constructor = isItSelf ? SelfReconstructibleHTMLElement : main`**: If called directly, use `SelfReconstructibleHTMLElement`. If extended, use the subclass.
  - **Line 41 `return new Constructor`**: Create fresh instance.
  - **Line 43 `return Self`**: Called without `new`, return self (callable).
- **Line 46 `Object.setPrototypeOf(Self, root)`**: Makes `new Self` instances have `root` in their prototype chain. This is what makes `instanceof` work.
- **Line 47 `Self.prototype.constructor = main`**: **Fixed from `root` to `main`** so `.constructor.name` works.
- **Line 50 `Self._element = document.createElement('div')`**: The backing DOM element for all proxy-forwarded operations.
- **Line 52 `return Self`**: Constructor returns a function object.

### Prototype chain setup (lines 58-59)

```javascript
Object.setPrototypeOf(SelfReconstructibleHTMLElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(SelfReconstructibleHTMLElement, HTMLElement);
```

- Line 58: Instances of `SelfReconstructibleHTMLElement` (and subclasses) will be `instanceof HTMLElement`.
- Line 59: The constructor function itself inherits from `HTMLElement` (so `MyHTMLElement` extends it properly).

### Proxy target (lines 62-65)

```javascript
const protoProps = { protoAddition: 'protoAddition' };
Object.setPrototypeOf(protoProps, SelfReconstructibleHTMLElement.prototype);
```

- `protoProps` is the proxy target.
- Its prototype is `SelfReconstructibleHTMLElement.prototype`, which chains to `HTMLElement.prototype`.
- So `protoProps.protoAddition` → found directly. `protoProps.innerHTML` → found on `HTMLElement.prototype`.

### Proxy handler `get` trap (lines 68-83)

```javascript
get(target, prop, receiver) {
    const domDesc = getDOMDescriptor(prop);
    if (domDesc && receiver && receiver._element) {
        const result = receiver._element[prop];
        if (typeof result === 'function') {
            return result.bind(receiver._element);
        }
        return result;
    }
    return Reflect.get(target, prop, receiver);
}
```

- **Line 69**: Check if this property is a DOM accessor or method.
- **Line 70**: If yes, and the receiver has a backing `_element`, forward to it.
- **Lines 73-74**: If it's a method, bind it to the real DOM element. **Critical:** Without `.bind()`, calling `myElement.appendChild(node)` would have `this` = the function instance, causing "Illegal invocation".
- **Line 81**: For non-DOM properties, use normal `Reflect.get`.

### Proxy handler `set` trap (lines 85-94)

```javascript
set(target, prop, value, receiver) {
    const domDesc = getDOMDescriptor(prop);
    if (domDesc && domDesc.set && receiver && receiver._element) {
        receiver._element[prop] = value;
        return true;
    }
    return Reflect.set(target, prop, value, receiver);
}
```

- **Line 87**: Only forward if the DOM descriptor has a setter. Some DOM properties are read-only.
- **Line 88**: Write to the real element.
- **Line 92**: For non-DOM properties, use normal `Reflect.set`.

### MyHTMLElement class (lines 99-108)

```javascript
class MyHTMLElement extends SelfReconstructibleHTMLElement {
    communicate(value) {
        this.innerHTML = ...;
    }
}
MyHTMLElement.prototype.addition = 'addition';
Object.setPrototypeOf(MyHTMLElement.prototype, proxy);
Object.setPrototypeOf(MyHTMLElement, SelfReconstructibleHTMLElement);
```

- **Line 99**: Class extends our self-reconstruct base.
- **Line 100-102**: `communicate` uses `this.innerHTML` which the proxy forwards to `this._element`.
- **Line 105**: `addition` is on the prototype (not a class field) so reconstructed instances inherit it.
- **Line 107**: The class prototype's prototype is the proxy, so all instances get proxy interception.
- **Line 108**: The constructor inherits from the base constructor.

### Reconstruction demo (lines 128-154)

```javascript
const reconstructed = new myElement;
```

This is the core feature. `myElement` is a `Self` function. Calling `new myElement`:
1. Enters `Self` with `new.target` set.
2. `isSelfInside` is false, `isCstrInside` is false (it's `MyHTMLElement`).
3. `Object.setPrototypeOf(ogp(this), root)` where `root` is the original `myElement` instance.
4. Recurses to create a fresh `Self`.
5. Returns it.

The result has `myElement` in its prototype chain, so `instanceof MyHTMLElement` works.

---

## Bugs, Fixes, and Limitations

### Bug 1: Illegal Invocation
**Symptom:** `myElement.innerText = 123` threw `TypeError: Illegal invocation`.
**Root cause:** Proxy returned DOM accessor setter; setter rejected function `this`.
**Fix:** Detect DOM accessors/methods in proxy and forward to backing `_element`.

### Bug 2: Class Fields Lost on Reconstruction
**Symptom:** `reconstructed.communicate()` showed `undefined` for `addition`.
**Root cause:** Class fields are initialized in constructor body; reconstruction never re-enters constructor.
**Fix:** Move data to prototype: `MyHTMLElement.prototype.addition = 'addition'`.

### Bug 3: Constructor Name is Undefined
**Symptom:** `reconstructed.constructor.name` was `undefined`.
**Root cause:** `Self.prototype.constructor = root` where `root` is an object, not a named function.
**Fix:** `Self.prototype.constructor = main` where `main` is the named class/function.

### Limitation 1: instanceof Function is False
**Cause:** `HTMLElement.prototype` and `Function.prototype` are on separate prototype branches.
**Acceptance:** Cannot be fixed without modifying global prototypes. Not critical for functionality.

### Limitation 2: No Real DOM Node
**Cause:** Self-reconstruct instances are functions.
**Mitigation:** All DOM operations are forwarded to `._element`. The instance itself is not in the DOM tree.

### Limitation 3: Proxy Performance
**Cause:** Every property access walks `HTMLElement.prototype` chain.
**Mitigation:** Could cache descriptors in a `Map` for production use.

---

## Final Architecture

```
seq (Self function, from new reconstructed)
  → prototype: { constructor: MyHTMLElement }
  → [[Prototype]]: reconstructed (another Self)
    → [[Prototype]]: myElement (another Self)
      → [[Prototype]]: proxy
        → [[Prototype]]: MyHTMLElement.prototype
          → [[Prototype]]: SelfReconstructibleHTMLElement.prototype
            → [[Prototype]]: HTMLElement.prototype
              → [[Prototype]]: Element.prototype
                → [[Prototype]]: Node.prototype
                  → [[Prototype]]: EventTarget.prototype
                    → [[Prototype]]: Object.prototype
                      → null
```

Each `Self` instance also has:
- `._element`: A real `<div>` for DOM operations.
- `[[Prototype]]` pointing to the parent instance, creating a chain where `instanceof` works at every level.

The proxy sits between the instance and `HTMLElement.prototype`, intercepting every property access:
- Custom properties → logged and resolved normally.
- DOM accessors/methods → forwarded to `._element`.

---

*End of document.*
