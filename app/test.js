/*global console*/

var obj = {
    "name": "John",
    "address": "Dubai",
    "grade": "A"
};

function foo() {
    'use strict';
    console.log("foo() called.");
    return false;
}

function baa() {
    'use strict';
    console.log("baa() called.");
    return true;
}

(function display() {
    'use strict';
    console.log("check iteration order of object properties:");
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            console.log(key, obj[key]);
        }
    }
    console.log("checking circuit evaluation of condition: ", foo() && baa());
}());