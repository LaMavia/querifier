"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_dict_1 = require("./distionaries/update.dict");
const condition_dict_1 = require("./distionaries/condition.dict");
const checkers_1 = require("./checkers");
const arayify_1 = require("./helpers/arayify");
const copy_1 = require("./helpers/copy");
const nativfy_1 = require("./helpers/nativfy");
exports.exception = console.exception || console.error;
exports.natifyCondition = nativfy_1.natifyCondition;
exports.natifyUpdate = nativfy_1.natifyUpdate;
exports.throwError = () => {
    throw new Error("[Querifier] Missing parameter");
};
/**
 * Not-mutating update function. Returns updated object
 * @param object
 * @param query
 */
exports.update = (object, query) => {
    const target = copy_1.copyObj(object);
    for (const prop in query) {
        if (prop in update_dict_1.dictionary) {
            // @ts-ignore
            update_dict_1.dictionary[prop](target)(query[prop]);
            // delete query[prop]
        }
        else {
            target[prop] = query[prop];
        }
    }
    return target;
};
exports.get = (object, query, settings = {}) => {
    const target = copy_1.copyObj(object);
    let output = [];
    for (const prop in query) {
        for (const q in query[prop]) {
            if (q in condition_dict_1.conditionDictionary && prop in target) {
                const f = condition_dict_1.conditionDictionary[q](query[prop][q]);
                output = output.concat((checkers_1.isArray(target[prop])
                    ? target[prop]
                    : arayify_1.arrayify(target[prop], settings.$mapper || (x => x))).filter(f || (() => true)));
                delete query[prop][q];
            }
        }
        delete query[prop];
    }
    for (const key in settings) {
        if (key in condition_dict_1.conditionSettings && key !== '$mapper') {
            output = condition_dict_1.conditionSettings[key](target, output)(settings[key]);
        }
    }
    return output;
};
exports.default = {
    update: exports.update,
    get: exports.get,
    natifyUpdate: exports.natifyUpdate,
    natifyCondition: exports.natifyCondition
};
