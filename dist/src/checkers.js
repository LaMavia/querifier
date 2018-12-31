"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const changers_1 = require("./helpers/changers");
exports.isObject = (x) => typeof x === "object";
exports.isArray = Array.isArray;
function compare(a, b) {
    let verdict = true;
    if (typeof a !== typeof b)
        verdict = false;
    else if (exports.isArray(a) && exports.isArray(b)) {
        for (const x of a) {
            verdict = Boolean(b.find(compare.bind({}, x)));
        }
    }
    else if (typeof a === "object") {
        if (a instanceof Map && b instanceof Map) {
            for (const [k, v] of a) {
                if (!verdict)
                    break;
                verdict = b.has(k) && b.get(k) === v;
            }
        }
        else if (a instanceof Set && b instanceof Set) {
            for (const v of a) {
                if (!verdict)
                    break;
                verdict = b.has(v);
            }
        }
        else if (a instanceof Object && b instanceof Object) {
            for (const k in a) {
                if (!verdict)
                    break;
                const va = changers_1.getVal(a, k);
                const vb = changers_1.getVal(b, k);
                // @ts-ignore
                verdict = typeof changers_1.getVal(b, k) !== "undefined" && compare(va, vb); //|| compare(vb, va)
            }
        }
    }
    else if (typeof a === typeof b) {
        verdict = a === b;
    }
    return verdict;
}
exports.compare = compare;
