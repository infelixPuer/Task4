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

