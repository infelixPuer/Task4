// Task 1: Object Property Manipulation
let person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@example.com"
}

for (let prop in person) {
    Object.defineProperty(person, prop, {
        writable: false
    });
}

person.updateInfo = function(newInfo) {
    for (let prop in newInfo) {
        if (!(prop in person)) throw new Error("Object newInfo must contain properties of person object!");

        this[prop] = newInfo[prop];
    }
};

person.address = {};
Object.defineProperty(person, "address", {
    enumerable: false,
    configurable: false,
})

// Task 2: Object Property Enumeration and Deletion
let product = {
    name: "Laptop",
    price: 1000,
    quantity: 5,
}

Object.defineProperties(product, {
    price: {
        writable: false,
        enumerable: false,
    },
    quantity: {
        writable: false,
        enumerable: false,
    }
})


function getTotalPrice(product) {
    const priceDescriptor = Object.getOwnPropertyDescriptor(product, "price");
    const quantityDescriptor = Object.getOwnPropertyDescriptor(product, "quantity");

    return priceDescriptor.value * quantityDescriptor.value;
}

function deleteNonConfigurable(obj, prop) {
    const propDescriptor = Object.getOwnPropertyDescriptor(obj, prop);

    if (!propDescriptor)
        throw new Error("Property does not exits on object!");

    if (!propDescriptor.configurable)
        throw new Error("Cannot delete non-configurable property!");

    delete obj[prop];
}

// Task 3: Object property getters and setters
const bankAccount = {
    _balance: 1000,
    get formattedBalance() {
        return `$${this._balance}`;
    },
    set balance(value) {
        this._balance = value;
    },
    transfer: function(bankAcc1, bankAcc2, amount) {
        let bankAcc1Balance = Number.parseInt(bankAcc1.formattedBalance.substring(1));
        let bankAcc2Balance = Number.parseInt(bankAcc2.formattedBalance.substring(1));

        if (bankAcc1Balance < amount)
            throw new Error("bankAcc1 does not have enough money!");

        bankAcc1.balance = bankAcc1Balance - amount;
        bankAcc2.balance = bankAcc2Balance + amount;
    }
};

// Task 4: Advanced Property Descriptors
function createImmutableObject(obj) {
    const objDescriptor = Object.getOwnPropertyDescriptors(obj);
    let newObj = Array.isArray(obj) ? [] : {};

    for (let prop in objDescriptor) {
        if (typeof obj[prop] === "object") {
            Object.defineProperty(newObj, prop, {
                value: createImmutableObject(obj[prop]),
                writable: false,
                enumerable: true,
            })
            continue;
        }

        if (!objDescriptor[prop].configurable) continue;

        Object.defineProperty(newObj, prop, {
            value: objDescriptor[prop].value,
            writable: false,
            enumerable: true,
        });
    }

    return newObj;
}

let immutablePerson = createImmutableObject(person);

// Task 5: Object Observation
function observeObject(obj, cb) {
    const handler = {
        get(target, prop, receiver) {
            cb(prop, "get");
            return Reflect.get(...arguments);
        },
        set(obj, prop, value) {
            cb(prop, "set", value);
            obj[prop] = value;
            return true;
        },
    }

    return new Proxy(obj, handler);
}

function callback(prop, action, value = null) {
    if (action === "get")
        console.log(`Property ${prop} is being accessed!`);

    if (action === "set" && value !== null)
        console.log(`Property ${prop} is being modified!\nNew value: ${value}`);
}

let personProxy = observeObject(person, callback);

// Task 6: Object Deep Cloning
function deepCloneObject(obj, clonedObjs = new WeakMap()) {
    if (clonedObjs.has(obj)) return obj;

    const newObj = Array.isArray(obj) ? [] : {};
    clonedObjs.set(obj, newObj);

    for (let prop in obj) {
        if (typeof obj[prop] === "object") {
            newObj[prop] = deepCloneObject(obj[prop], clonedObjs);
            continue;
        }

        newObj[prop] = obj[prop];
    }

    return newObj;
}
