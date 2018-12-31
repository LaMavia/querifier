"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function arrayify(obj, mapper) {
    const output = [];
    if (obj instanceof Map || obj instanceof Set) {
        for (const v of obj) {
            output.push(mapper ? mapper(v) : v);
        }
    }
    else {
        for (const key in obj) {
            output.push(mapper ? mapper(obj[key]) : obj[key]);
        }
    }
    return output;
}
exports.arrayify = arrayify;
