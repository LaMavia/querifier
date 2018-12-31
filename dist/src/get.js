"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const condition_dict_1 = require("./distionaries/condition.dict");
const _1 = require(".");
const copy_1 = require("./helpers/copy");
const checkers_1 = require("./checkers");
const arayify_1 = require("./helpers/arayify");
const changers_1 = require("./helpers/changers");
function get(object, query = {}, settings = {}) {
    const target = copy_1.copyObj(object);
    const sts = Object.assign({}, settings, { $sort: settings.$sort || "asc", $mapper: settings.$mapper || (x => x) });
    let output = [];
    for (const prop in query) {
        // Push every collection without conditions in query 
        const arr = prop in target
            ? arayify_1.arrayify(changers_1.getVal(target, prop))
            : [];
        if (Object.keys(query[prop]).length === 0)
            output = output.concat(arr);
        // Push collections filtered by conditions from the query
        if (!(prop in target)) {
            _1.exception(`[get]> Collection "${prop}" doesn't exist in the target "${JSON.stringify(target, null, 2).replace(/\[\s(^\s+[\d(?:"\w+\s\w")]+,?\s)+/gmi, "...")}`);
            continue;
        }
        for (const q in query[prop]) {
            if (q in condition_dict_1.conditionDictionary && prop in target) {
                const f = condition_dict_1.conditionDictionary[q](changers_1.getVal(query, prop, q)); // query[prop][q]
                output = (output.concat((checkers_1.isArray(target[prop])
                    ? changers_1.getVal(target, prop)
                    : arayify_1.arrayify(changers_1.getVal(target, prop), sts.$mapper))).filter(f || (() => true)));
                delete query[prop][q];
            }
        }
        delete query[prop];
    }
    for (const key in sts) {
        if (key in condition_dict_1.conditionSettings && key !== '$mapper') {
            output = condition_dict_1.conditionSettings[key](target, output)(sts[key]);
        }
    }
    return output;
}
exports.get = get;
