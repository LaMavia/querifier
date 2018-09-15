"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const checkers_1 = require("../checkers");
exports.conditionDictionary = {
    $eq: (condition = index_1.throwError()) => (item) => item === condition,
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
        return conditions.some(con => item === con);
    },
    $nin: (conditions = index_1.throwError()) => (item) => {
        if (!checkers_1.isArray(conditions)) {
            index_1.exception(`[$in]> "${JSON.stringify(conditions)} is not an array"`);
            return true;
        }
        return !conditions.some(con => item === con);
    },
    $and: (conditionQ) => (item) => conditionQ.every(condition => {
        for (const key in condition) {
            if (key in exports.conditionDictionary) {
                // @ts-ignore
                if (!exports.conditionDictionary[key](condition[key])(item))
                    return false;
            }
            else {
                return item === condition[key];
            }
        }
        return true;
    }),
    $or: (conditionQ) => (item) => conditionQ.some(condition => {
        for (const key in condition) {
            if (key in exports.conditionDictionary) {
                // @ts-ignore
                if (!exports.conditionDictionary[key](condition[key])(item))
                    return false;
            }
            else {
                return item === condition[key];
            }
        }
        return true;
    }),
    $not: (condition) => (item) => {
        if (typeof condition === "object") {
            for (const key in condition) {
                if (key in exports.conditionDictionary) {
                    // @ts-ignore
                    return !exports.conditionDictionary[key](condition[key])(item);
                }
                else {
                    return !(item === condition[key]);
                }
            }
        }
        else {
            // @ts-ignore
            return !(condition === item);
        }
        return true;
    },
    $type: (type) => (item) => type === "array"
        ? checkers_1.isArray(item)
        : typeof item === type
};
