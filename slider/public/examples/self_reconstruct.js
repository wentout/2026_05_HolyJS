'use strict';

debugger;

const ogp = Object.getPrototypeOf;
const ohp = Object.prototype.hasOwnProperty;

const Cstr = function () {
    ole.log(this.value);
    const root = this;
    const main = this.constructor;
    const isItSelf = main === Cstr;
    const Self = function () {
        if (new.target) {
            const isSelfInside = this.constructor === Self;
            const isCstrInside = this.constructor === Cstr;
            // so, all three checks are not necessary to identify
            // that we are inside of extended class constructor
            // if (!isItSelf && !isSelfInside && !isCstrInside) {
            if (!isSelfInside && !isCstrInside) {
                console.log('inside extended class');
                // so here is a direct call from extended class
                // therefore we already have everything from that class
                // but the rest of prototype chain is not set
                // so we need to set it to the root
                // and then just return this as it kept untouched
                Object.setPrototypeOf(ogp(this), root);
                const ExSelf = Cstr.call(this);
                return ExSelf;
            }
            // but inspite of comment in line 29
            // these check is strictly necessary
            // and we can't make just
            // const Constructor = Cstr;
            // case we loose "sequential processing" then
            const Constructor = isItSelf ? Cstr : main;
            const result = new Constructor;
            return result;
        }

        // here we are returning the same item
        return Self;

        // but, it may be used for returning Self
        // or for Amending this Execution Scope
        // so there are plenty ways of using it
    };
    // Object.setPrototypeOf(Self, isItSelf ? main : root);
    Object.setPrototypeOf(Self, root);
    Self.prototype.constructor = root; // item instanceof item
    Self.value++;
    return Self;
};

Object.setPrototypeOf(Cstr.prototype, Cstr); // instanceof Function
Cstr.prototype.value = 0;

// if we had
// Cstr.prototype = Cstr;
// then so instead of
// Cstr.prototype.constructor = Cstr;
// which is obvious for instanceof and constructor.name
// person with JS mindset should make something like
// Object.defineProperty(Cstr.prototype, 'constructor', {
//     value: Cstr,
//     enumerable: false,
//     configurable: true,
//     writable: true
// });
// though let keep go deeper with that approach
// and make the same behaviour, but untouched forever
// also that is why line with
// self.prototype.constructor = Cstr; 
// was commented for this gist re-versions history, when it was by number 17
// it was not so necessary anymore
// so prefered way was to comment it,
// cause it is irrelevant to the following
// completely working piece of art
// Object.defineProperty(Cstr.prototype, 'constructor', {
//     get() {
//         // console.log(
//         //     'Cstr.prototype.constructor getter',
//         //     this,
//         //     this instanceof Cstr,
//         //     ogp(this).constructor === Cstr
//         // ); // Self ???
//         return Cstr;
//     }
// });
// however we just may place Cstr in depth of .prototype prototype chain
// but now there is Object.setPrototypeOf(Self, root); on that place
// cause it is needed for prototype chain to be combined correctly


console.log('\n something about construction : \n');

debugger;
const item = new Cstr();

console.log('item instanceof Cstr     : ', item instanceof Cstr);        // true
console.log('item instanceof Object   : ', item instanceof Object);      // true
console.log('item instanceof Function : ', item instanceof Function);    // true

console.log('item.constructor.name    : ', item.constructor.name);       // Cstr
console.log('item.value               : ', item.value);                  // 1

console.log('\n\n so let explain how and why then : \n');

console.log('Object.hasOwnProperty.call(item, \'value\')                : ', ohp.call(item, 'value'));                          // true
console.log('Object.hasOwnProperty.call(ogp(item), \'value\')           : ', ohp.call(ogp(item), 'value'));                     // false
console.log('Object.hasOwnProperty.call(ogp(ogp(item)), \'value\')      : ', ohp.call(ogp(ogp(item)), 'value'));                // true
console.log('Object.hasOwnProperty.call(ogp(ogp(ogp(item))), \'value\') : ', ohp.call(ogp(ogp(ogp(item))), 'value'));           // false

console.log('so item.value is          : ', item.value, ' 1 → from proto chain');      // 1 → from proto chain
console.log('ogp(item).value           : ', ogp(item).value, ' 0 → from proto chain'); // 0 → from proto chain
console.log('ogp(ogp(item)).value      : ', ogp(ogp(item)).value, ' 0 directly');      // 0 directly
console.log('ogp(ogp(ogp(item))).value : ', ogp(ogp(ogp(item))).value, ' undefined');  // undefined

console.log('ogp(ogp(ogp(item))) : ', ogp(ogp(ogp(item))));                            // [Function: Cstr]
console.log('ogp(ogp(ogp(ogp(item)))) : ', ogp(ogp(ogp(ogp(item)))));                       // [Function (anonymous)] Object
console.log('ogp(ogp(ogp(ogp(ogp(item))))) : ', ogp(ogp(ogp(ogp(ogp(item))))));                  // Object: null prototype
console.log('ogp(ogp(ogp(ogp(ogp(ogp(item)))))) : ', ogp(ogp(ogp(ogp(ogp(ogp(item)))))));             // null

new item; // newable
item();   // callable

console.log('\n\n and about re-construction : \n');


debugger;
const re = new item;


console.log('re instanceof Cstr       : ', re instanceof Cstr);          // true
console.log('re instanceof Object     : ', re instanceof Object);        // true
console.log('re instanceof Function   : ', re instanceof Function);      // true
console.log('re.constructor.name      : ', re.constructor.name);         // Cstr

console.log('item.value : ', item.value); // 1
console.log('re.value   : ', re.value);   // 1

new re; // newable
re();   // callable


console.log('item proto should be null    : ', ogp(ogp(ogp(ogp(ogp(ogp(item)))))));    // null
console.log('re proto also should be null : ', ogp(ogp(ogp(ogp(ogp(ogp(re)))))));      // null

console.log('\n\n and about class extention : \n');


// other piece
debugger;
class ExtendedCstr extends Cstr { };
const entity = new ExtendedCstr();


console.log('entity instanceof ExtendedCstr : ', entity instanceof ExtendedCstr);  // true
console.log('entity instanceof Cstr         : ', entity instanceof Cstr);          // true
console.log('entity instanceof Object       : ', entity instanceof Object);        // true
console.log('entity instanceof Function     : ', entity instanceof Function);      // true

console.log('\n');

console.log('should be ExtendedCstr         : ', entity.constructor.name);                 // ExtendedCstr
console.log('should be Cstr                 : ', ogp(ogp(ogp(entity))).constructor.name);  // Cstr

console.log(' \n---\n ');

new entity; // newable
entity();   // callable

console.log('item.value       : ', item.value);          // 1
console.log('re.value         : ', re.value);            // 1
console.log('entity.value     : ', entity.value);        // 1
console.log('should be null   : ', ogp(ogp(ogp(ogp(ogp(ogp(ogp(entity))))))));   // null, so its +1 cause of extension


console.log('\n\n and sequential processing is just : \n');

debugger;
const past = new entity;
console.log('sequential entity instanceof ExtendedCstr : ', past instanceof ExtendedCstr);     // true
console.log('sequential entity instanceof Cstr         : ', past instanceof Cstr);             // true
console.log('sequential entity instanceof Object       : ', past instanceof Object);           // true
console.log('sequential entity instanceof Function     : ', past instanceof Function);         // true

console.log('\n and about sequential values : \n');

console.log('(new past).value : ', (new past).value);
console.log('past().value     : ', past().value);

console.log('\n and about sequential proto : \n');

console.log('should be null : ', ogp(ogp(ogp(ogp(ogp(ogp(ogp(past))))))));   // null, same as entity

console.log('\n\n and where values are stored : \n');

console.log('past.value : ', past.value, ' 1 directly from past');           // 1 directly from past
console.log('ogp(past).value : ', ogp(past).value, ' 0 → from proto chain');      // 0 → from proto chain
console.log('ogp(ogp(past)).value : ', ogp(ogp(past)).value, ' 0 → from proto chain'); // 0 → from proto chain
console.log('ogp(ogp(ogp(past))).value : ', ogp(ogp(ogp(past))).value, ' 0 directly');      // 0 directly
console.log('ogp(ogp(ogp(ogp(past)))).value : ', ogp(ogp(ogp(ogp(past)))).value, ' undefined');  // undefined


console.log('\n\n so let explain how and why then : \n');

console.log('Object.hasOwnProperty.call(item, \'value\')      : ', ohp.call(item, 'value'));      // false
console.log('Object.hasOwnProperty.call(ogp(item), \'value\') : ', ohp.call(ogp(item), 'value')); // true

console.log('item.value : ', item.value, ' 1 → from proto chain');            // 1 → from proto chain
console.log('ogp(item).value : ', ogp(item).value, ' 0 → from proto chain');       // 0 → from proto chain
console.log('ogp(ogp(item)).value : ', ogp(ogp(item)).value, ' 0 → from proto chain');  // 0 → from proto chain
console.log('ogp(ogp(ogp(item))).value : ', ogp(ogp(ogp(item))).value, ' undefined');        // undefined

console.log('ogp(ogp(ogp(item))) : ', ogp(ogp(ogp(item))));                            // [Function: Cstr]
console.log('ogp(ogp(ogp(ogp(item)))) : ', ogp(ogp(ogp(ogp(item)))));                       // [Function (anonymous)] Object
console.log('ogp(ogp(ogp(ogp(ogp(item))))) : ', ogp(ogp(ogp(ogp(ogp(item))))));                  // Object: null prototype
console.log('ogp(ogp(ogp(ogp(ogp(ogp(item)))))) : ', ogp(ogp(ogp(ogp(ogp(ogp(item)))))));             // null

console.log('\n\n and let extend class from extended class : \n');


debugger;
class ExtendedExtendedCstr extends ExtendedCstr {
    constructor() {
        super();
    }
}

const exExCstrCstr = new ExtendedExtendedCstr();
console.log('exExCstrCstr instanceof ExtendedExtendedCstr   : ', exExCstrCstr instanceof ExtendedExtendedCstr);    // true
console.log('exExCstrCstr instanceof ExtendedCstr           : ', exExCstrCstr instanceof ExtendedCstr);            // true
console.log('exExCstrCstr instanceof Cstr                   : ', exExCstrCstr instanceof Cstr);                    // true
console.log('exExCstrCstr instanceof Object                 : ', exExCstrCstr instanceof Object);                  // true
console.log('exExCstrCstr instanceof Function               : ', exExCstrCstr instanceof Function);                // true
console.log('exExCstrCstr.constructor.name                  : ', exExCstrCstr.constructor.name);                   // ExtendedExtendedCstr


console.log('\n\n let check if composed class based item works : \n');

debugger;
exExCstrCstr();                        // callable
const exExExCstrCstr = new exExCstrCstr; // newable

console.log('exExExCstrCstr instanceof ExtendedExtendedCstr : ', exExExCstrCstr instanceof ExtendedExtendedCstr);  // true
console.log('exExExCstrCstr instanceof ExtendedCstr         : ', exExExCstrCstr instanceof ExtendedCstr);          // true
console.log('exExExCstrCstr instanceof Cstr                 : ', exExExCstrCstr instanceof Cstr);                  // true
console.log('exExExCstrCstr instanceof Object               : ', exExExCstrCstr instanceof Object);                // true
console.log('exExExCstrCstr instanceof Function             : ', exExExCstrCstr instanceof Function);              // true
console.log('exExExCstrCstr.constructor.name                : ', exExExCstrCstr.constructor.name);                 // ExtendedExtendedCstr


console.log('\n\n and let extend class from exExExCstrCstr : \n');


debugger;
class ItemExtendedCstr extends exExExCstrCstr {
    constructor() {
        console.log('ItemExtendedCstr constructor');
        super();
    }
};

const itemItem = new ItemExtendedCstr();

console.log('itemItem instanceof ItemExtendedCstr     : ', itemItem instanceof ItemExtendedCstr);      // true
console.log('itemItem instanceof ExtendedExtendedCstr : ', itemItem instanceof ExtendedExtendedCstr);  // true
console.log('itemItem instanceof ExtendedCstr         : ', itemItem instanceof ExtendedCstr);          // true
console.log('itemItem instanceof Cstr                 : ', itemItem instanceof Cstr);                  // true
console.log('itemItem instanceof Object               : ', itemItem instanceof Object);                // true
console.log('itemItem instanceof Function             : ', itemItem instanceof Function);              // true
console.log('itemItem.constructor.name                : ', itemItem.constructor.name);                 // ItemExtendedCstr

console.log('\n\n and let check if composed itemItem works : \n');

debugger;
itemItem();
const postItemItem = new itemItem;

console.log('HERE')
console.log('postItemItem instanceof ItemExtendedCstr     : ', postItemItem instanceof ItemExtendedCstr);      // true
console.log('postItemItem instanceof ExtendedExtendedCstr : ', postItemItem instanceof ExtendedExtendedCstr);  // true
console.log('postItemItem instanceof ExtendedCstr         : ', postItemItem instanceof ExtendedCstr);          // true
console.log('postItemItem instanceof Cstr                 : ', postItemItem instanceof Cstr);                  // true
console.log('postItemItem instanceof Object               : ', postItemItem instanceof Object);                // true
console.log('postItemItem instanceof Function             : ', postItemItem instanceof Function);              // true
console.log('postItemItem.constructor.name                : ', postItemItem.constructor.name);                 // ItemExtendedCstr

console.log('\n\n and let check composed postItemItem works : \n');

debugger;
postItemItem();
const postPostItemItem = new postItemItem;

console.log('THERE')
console.log('postPostItemItem instanceof ItemExtendedCstr     : ', postPostItemItem instanceof ItemExtendedCstr);     // true
console.log('postPostItemItem instanceof ExtendedExtendedCstr : ', postPostItemItem instanceof ExtendedExtendedCstr); // true
console.log('postPostItemItem instanceof ExtendedCstr         : ', postPostItemItem instanceof ExtendedCstr);         // true
console.log('postPostItemItem instanceof Cstr                 : ', postPostItemItem instanceof Cstr);                 // true
console.log('postPostItemItem instanceof Object               : ', postPostItemItem instanceof Object);               // true
console.log('postPostItemItem instanceof Function             : ', postPostItemItem instanceof Function);             // true
console.log('postPostItemItem.constructor.name                : ', postPostItemItem.constructor.name);                // ItemExtendedCstr

console.log('postPostItemItem.value : ', postPostItemItem.value, ' 1 directly from postPostItemItem');                                         // 1 directly from postPostItemItem
console.log('ogp(postPostItemItem).value : ', ogp(postPostItemItem).value, ' 0 → from proto chain');                                                // 0 → from proto chain
console.log('ogp(ogp(postPostItemItem)).value : ', ogp(ogp(postPostItemItem)).value, ' 0 → from proto chain');                                           // 0 → from proto chain
console.log('ogp(ogp(ogp(postPostItemItem))).value : ', ogp(ogp(ogp(postPostItemItem))).value, ' 0 → from proto chain');                                      // 0 → from proto chain
console.log('ogp(ogp(ogp(ogp(postPostItemItem)))).value : ', ogp(ogp(ogp(ogp(postPostItemItem)))).value, ' 0 → from proto chain');                                 // 0 → from proto chain
console.log('ogp(ogp(ogp(ogp(ogp(postPostItemItem))))).value : ', ogp(ogp(ogp(ogp(ogp(postPostItemItem))))).value, ' 0 → from proto chain');                            // 0 → from proto chain
console.log('ogp(ogp(ogp(ogp(ogp(ogp(postPostItemItem)))))).value : ', ogp(ogp(ogp(ogp(ogp(ogp(postPostItemItem)))))).value, ' 0 directly from proto chain');                // 0 directly from proto chain
console.log('ogp(ogp(ogp(ogp(ogp(ogp(ogp(postPostItemItem))))))).value : ', ogp(ogp(ogp(ogp(ogp(ogp(ogp(postPostItemItem))))))).value, ' finally undefined');                     // undefined
console.log('should be [Function (anonymous)] Object : ', ogp(ogp(ogp(ogp(ogp(ogp(ogp(ogp(postPostItemItem)))))))));
console.log('which value is undefined                : ', ogp(ogp(ogp(ogp(ogp(ogp(ogp(ogp(postPostItemItem)))))))).value);
console.log('and which proto ... prototype is null   : ', ogp(ogp(ogp(ogp(ogp(ogp(ogp(ogp(ogp(ogp(postPostItemItem)))))))))));

// root, should not be instance of itself
console.log('!(item instanceof item)                  : ', !(item instanceof item));                  // true, as should be

debugger;
// nested
console.log('\n\n and yea, items are instancof items\n');

console.log('re instanceof item                       : ', re instanceof item);                       // true
console.log('past instanceof entity                   : ', past instanceof entity);                   // true
console.log('exExExCstrCstr instanceof exExCstrCstr   : ', exExExCstrCstr instanceof exExCstrCstr);   // true
console.log('itemItem instanceof exExExCstrCstr       : ', itemItem instanceof exExCstrCstr);         // true, same as exExExCstrCstr
console.log('postItemItem instanceof itemItem         : ', postItemItem instanceof itemItem);         // true
console.log('postPostItemItem instanceof itemItem ̣    : ', postPostItemItem instanceof itemItem);     // true
console.log('postPostItemItem instanceof postItemItem : ', postPostItemItem instanceof postItemItem); // true

console.log('\n so... bye then ... see ya ... \n');
