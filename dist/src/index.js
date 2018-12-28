"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nativfy_1 = require("./helpers/nativfy");
const get_1 = require("./get");
const update_1 = require("./update");
exports.exception = console.exception || console.error;
exports.natifyCondition = nativfy_1.natifyCondition;
exports.natifyUpdate = nativfy_1.natifyUpdate;
exports.throwError = () => {
    throw new Error("[Querifier] Missing parameter");
};
exports.default = {
    update: update_1.update,
    get: get_1.get,
    natifyUpdate: exports.natifyUpdate,
    natifyCondition: exports.natifyCondition
};
