"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkers_1 = require("../checkers");
function copyArray(arr) {
    const out = [];
    for (const x of arr) {
        if (checkers_1.isArray(x)) {
            // @ts-ignore
            out.push(copyArray(x));
        }
        else if (typeof x === "object") {
            out.push(copyObj(x));
        }
        else {
            out.push(x);
        }
    }
    return out;
}
exports.copyArray = copyArray;
function copyObj(obj) {
    let out;
    if (obj instanceof Map) {
        out = new Map(obj.entries());
    }
    else if (obj instanceof Set) {
        out = new Set(obj.values());
    }
    else {
        out = {};
        for (const prop in obj) {
            const x = obj[prop];
            if (checkers_1.isArray(obj[prop])) {
                // @ts-ignore
                out[prop] = copyArray(x);
            }
            else if (checkers_1.isObject(x)) {
                out[prop] = copyObj(obj[prop]);
            }
            else {
                out[prop] = obj[prop];
            }
        }
    }
    // @ts-ignore
    return out;
}
exports.copyObj = copyObj;
