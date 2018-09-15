"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
exports.arrayDictionary = {
    $each: (target) => (items = index_1.throwError()) => target.concat(items)
};
