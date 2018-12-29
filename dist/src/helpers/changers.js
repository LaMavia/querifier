"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a tuple of: [Rest of the keys, Last key]
 * @param keys
 * @returns [string, string]
 */
function splitKeys(...keys) {
    const matched = keys.join(".").match(/(.*)*\.([\w\d]*)$/);
    try {
        return [matched[0], matched.length > 2 ? matched[2] : ''];
    }
    catch (err) {
        console.error(`[<HELPER> splitKeys]> Error splitting "${keys}"`);
        return [keys.splice(0, keys.length - 2).join('.'), keys[keys.length - 1]];
    }
    // const ks = keys.reduce((acc, k) => acc.concat(typeof k === "string" ? k.split(".") : ([k] as any)), [])
}
exports.splitKeys = splitKeys;
/**
 * Sets a value of either a Map, Object or a Set. May throw an error if the target is either immutable, sealed or frozen.
 * @param {Object | Map | Set} target
 * @param {String | Number | Symbol} key
 * @param {any} value
 */
function set(target, key, value) {
    const t = getPrelastValue(target, key);
    let p; // Last key
    if (typeof key === 'string') {
        const keys = key.split(".");
        p = keys[keys.length - 1];
    }
    else {
        p = key;
    }
    if (t instanceof Map) {
        t.set(p, value);
    }
    else if (t instanceof Set) {
        t.add(value);
    }
    else {
        t[p] = value;
    }
    return target;
}
exports.set = set;
function del(target, key) {
    const t = getPrelastValue(target, key);
    const [_, p] = splitKeys(key);
    if (t instanceof Map) {
        t.delete(p);
    }
    else if (target instanceof Set) {
        t.delete(p);
    }
    else {
        delete t[p];
    }
    return target;
}
exports.del = del;
function getVal(target, ...keys) {
    let lastVal = target;
    for (const key of keys.reduce((acc, k) => acc.concat(typeof k === "string" ? k.split(".") : [k]), [])) {
        let next;
        if (lastVal instanceof Map) {
            next = lastVal.get(key);
        }
        else {
            next = lastVal[key];
        }
        if (typeof next === "undefined" || next === null)
            break;
        else
            lastVal = next;
    }
    return lastVal;
}
exports.getVal = getVal;
function getPrelastValue(target, ...keys) {
    const matched = keys.join(".").match(/(.*)*\.[\w\d]*$/);
    return getVal(target, ...((matched
        ? matched.length > 0 ? matched[1] : matched[0] || ""
        : '').split(".")));
}
exports.getPrelastValue = getPrelastValue;
