"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const checkers_1 = require("../checkers");
const condition_dict_1 = require("./condition.dict");
const array_dict_1 = require("./array.dict");
const update_1 = require("../update");
exports.dictionary = {
    $set: (target) => (obj = index_1.throwError()) => {
        for (const prop in obj) {
            if (typeof target[prop] !== typeof obj[prop]) {
                index_1.exception(`[$set]> typeof ${JSON.stringify(target[prop])} doesn't match typeof ${JSON.stringify(obj[prop])}`);
                continue;
            }
            // Watchout for readonly props
            try {
                target[prop] = obj[prop];
            }
            catch (e) {
                index_1.exception(`[$set]> Error setting value of ${JSON.stringify(target[prop])}: "${e}"`);
            }
        }
        return target;
    },
    $inc: (target) => (obj = index_1.throwError()) => {
        for (const prop in obj) {
            if (typeof obj[prop] !== "number" || obj[prop] === NaN) {
                index_1.exception(`[$inc]> ${JSON.stringify(obj[prop])} is not a number`);
                continue;
            }
            if (typeof target[prop] !== "number" || target[prop] === NaN) {
                index_1.exception(`[$inc]> ${JSON.stringify(target[prop])} is not a number`);
                continue;
            }
            try {
                target[prop] = (target[prop] || 0) + (obj[prop] || 0);
            }
            catch (e) {
                index_1.exception(`[$inc]> Error incrementing ${JSON.stringify(target[prop])}`);
            }
        }
        return target;
    },
    $min: (target) => (obj = index_1.throwError()) => {
        for (const prop in obj) {
            try {
                target[prop] = obj[prop] < target[prop]
                    ? obj[prop]
                    : target[prop];
            }
            catch (e) {
                index_1.exception(`[$min]> Error setting ${target[prop]}`);
            }
        }
        return target;
    },
    $max: (target) => (obj = index_1.throwError()) => {
        for (const prop in obj) {
            try {
                target[prop] = obj[prop] > target[prop]
                    ? obj[prop]
                    : target[prop];
            }
            catch (e) {
                index_1.exception(`[$max]> Error setting ${target[prop]}`);
            }
        }
        return target;
    },
    $mul: (target) => (obj = index_1.throwError()) => {
        for (const prop in obj) {
            if (typeof obj[prop] !== "number" || obj[prop] === NaN) {
                index_1.exception(`[$mul]> ${JSON.stringify(obj[prop])} is not a number`);
                continue;
            }
            if (typeof target[prop] !== "number" || target[prop] === NaN) {
                index_1.exception(`[$mul]> ${JSON.stringify(target[prop])} is not a number`);
                continue;
            }
            try {
                target[prop] = target[prop]
                    ? target[prop] * (obj[prop] || 1)
                    : 0;
            }
            catch (e) {
                index_1.exception(`[$mul]> Error multiplying target[${prop}]`);
            }
        }
        return target;
    },
    $rename: (target) => (obj = index_1.throwError()) => {
        const validsKeys = ["symbol", "string", "number"];
        for (const oldKey in obj) {
            let val;
            const newKey = obj[oldKey];
            if (!validsKeys.some(x => x === typeof newKey) || !newKey) {
                index_1.exception(`[$rename]> ${obj[oldKey]} isn't a valid key`);
                continue;
            }
            if (target[oldKey]) {
                val = target[oldKey];
                delete target[oldKey];
            }
            Object.assign(target, { [newKey]: val });
        }
        return target;
    },
    $unset: (target) => (obj = index_1.throwError()) => {
        for (const key in obj)
            (key in target) && delete target[key];
        return target;
    },
    $addToSet: (target) => (obj = index_1.throwError()) => {
        for (const prop in obj) {
            if (!checkers_1.isArray(target[prop])) {
                index_1.exception(`[$addToSet]> "${prop}" is not an array`);
                continue;
            }
            const valid = checkers_1.isArray(obj[prop])
                ? obj[prop].filter((toAdd) => !target[prop].some((x) => x === toAdd))
                : (target[prop].some((x) => x === obj[prop])
                    ? null
                    : obj[prop]);
            valid && target[prop].push(valid);
        }
        return target;
    },
    $pull: (target) => (query = index_1.throwError()) => {
        for (const arrayName in query) {
            let array = target[arrayName];
            if (!checkers_1.isArray(array)) {
                index_1.exception(`[$pull]> "${arrayName}" is not an array`);
                continue;
            }
            if (typeof query[arrayName] === "object") {
                for (const condition in query[arrayName]) {
                    if (condition in condition_dict_1.conditionDictionary) {
                        array = array.filter(x => 
                        // @ts-ignore
                        !condition_dict_1.conditionDictionary[condition](query[arrayName][condition])(x));
                    }
                    else {
                        array = array.filter(x => x !== condition);
                    }
                }
            }
            else {
                array = array.filter(x => x !== query[arrayName]);
            }
            try {
                target[arrayName] = array;
            }
            catch (e) {
                index_1.exception(`[$pull]> Error setting value of "${arrayName}"`);
            }
        }
        return target;
    },
    $pop: (target) => (query = index_1.throwError()) => {
        for (const key in query) {
            const array = [...target[key]];
            if (checkers_1.isArray(array)) {
                switch (query[key]) {
                    case -1:
                        array.shift();
                        break;
                    case 1:
                        array.pop();
                        break;
                    default:
                        ;
                        break;
                }
                try {
                    target[key] = array;
                }
                catch (e) {
                    index_1.exception(`[$pop]> Error setting value of "${key}"`);
                }
            }
        }
        return target;
    },
    $push: (target) => (query = index_1.throwError()) => {
        for (const key in query) {
            let array = [...target[key]];
            if (typeof query[key] === "object") {
                for (const mod in query[key]) {
                    if (mod in array_dict_1.arrayDictionary) {
                        // @ts-ignore
                        array = array_dict_1.arrayDictionary[mod](array)(query[key][mod]) || array;
                    }
                    else {
                        array.push(query[key][mod]);
                    }
                }
            }
            else {
                array.push(query[key]);
            }
            try {
                target[key] = array;
            }
            catch (e) {
                index_1.exception(`[$push]> Error setting value of "${key}"`);
            }
        }
        return target;
    },
    $each: (target) => (query) => {
        debugger;
        for (const arrn in query) {
            if (target[arrn] && checkers_1.isArray(target[arrn])) {
                for (const i in target[arrn]) {
                    const obj = target[arrn][i];
                    if (checkers_1.isObject(obj)) {
                        target[arrn][i] = update_1.update(obj, query[arrn]);
                    }
                }
            }
        }
        return target;
    },
};
