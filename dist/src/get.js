"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const condition_dict_1 = require("./distionaries/condition.dict");
const copy_1 = require("./helpers/copy");
const checkers_1 = require("./checkers");
const arayify_1 = require("./helpers/arayify");
function get(object, query, settings = {}) {
    const target = copy_1.copyObj(object);
    const sts = Object.assign({}, settings, { $sort: settings.$sort || "asc", $mapper: settings.$mapper || (x => x) });
    let output = [];
    for (const prop in query) {
        for (const q in query[prop]) {
            if (q in condition_dict_1.conditionDictionary && prop in target) {
                const f = condition_dict_1.conditionDictionary[q](query[prop][q]);
                output = (output.concat((checkers_1.isArray(target[prop])
                    ? target[prop]
                    : arayify_1.arrayify(target[prop], sts.$mapper))).filter(f || (() => true)));
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
