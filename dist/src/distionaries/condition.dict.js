"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const checkers_1 = require("../checkers");
exports.conditionSettings = {
    $inject: (target, output) => (items) => {
        for (const key in items) {
            if (items[key]) {
                output = output.concat(checkers_1.isArray(target[key])
                    ? target[key]
                    : [target[key]]);
            }
        }
        return output;
    },
    $sort: (target, output) => (order) => 
    // @ts-ignore
    order === "asc" ? output.sort((a, b) => a - b) : output.sort((a, b) => b - a),
    $mapper: (target, output) => (callback) => output.map(callback)
};
exports.conditionDictionary = {
    $eq: (condition = index_1.throwError()) => (item) => checkers_1.compare(condition, item),
    $ne: (condition = index_1.throwError()) => (item) => item !== condition,
    $gt: (condition = index_1.throwError()) => (item) => item > condition,
    $gte: (condition = index_1.throwError()) => (item) => item >= condition,
    $lt: (condition = index_1.throwError()) => (item) => item < condition,
    $lte: (condition = index_1.throwError()) => (item) => item <= condition,
    $in: (conditions = index_1.throwError()) => (item) => {
        if (!checkers_1.isArray(conditions)) {
            index_1.exception(`[$in]> "${JSON.stringify(conditions)} is not an array"`);
            return true;
        }
        return conditions.some(con => con instanceof RegExp
            ? con.test(typeof item === "string" ? item : String(item))
            : item === con);
    },
    $nin: (conditions = index_1.throwError()) => (item) => {
        if (!checkers_1.isArray(conditions)) {
            index_1.exception(`[$in]> "${JSON.stringify(conditions)} is not an array"`);
            return true;
        }
        return !conditions.some(con => con instanceof RegExp
            ? con.test(typeof item === "string" ? item : String(item))
            : item === con);
    },
    $and: (conditionQ) => (item) => conditionQ.every(condition => {
        for (const key in condition) {
            // @ts-ignore
            if (key in exports.conditionDictionary && !exports.conditionDictionary[key](condition[key])(item))
                return false;
            if (!item === condition[key])
                return false;
        }
        return true;
    }),
    $or: (conditionQ) => (item) => conditionQ.some(condition => {
        for (const key in condition) {
            // @ts-ignore
            if (key in exports.conditionDictionary && !exports.conditionDictionary[key](condition[key])(item)) {
                return false;
            }
            else if (!item === condition[key]) {
                return false;
            }
        }
        return true;
    }),
    $not: (condition) => (item) => {
        if (typeof condition === "object") {
            for (const key in condition) {
                if (key in exports.conditionDictionary &&
                    // @ts-ignore
                    !exports.conditionDictionary[key](condition[key])(item)) {
                    return true;
                }
                else if (item !== condition[key])
                    return false;
            }
            return false;
        }
        // @ts-ignore
        return !(condition === item);
    },
    $type: (type) => (item) => type === "array"
        ? checkers_1.isArray(item)
        : typeof item === type,
    $match: (regexp) => (item) => 
    // @ts-ignore  
    regexp.test(item),
    $exec: (f) => f
};
