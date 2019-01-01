"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_dict_1 = require("./dictionaries/update.dict");
const copy_1 = require("./helpers/copy");
/**
 * Not-mutating update function. Returns updated object
 * @param object
 * @param query
 */
exports.update = (object, query) => {
    const target = copy_1.copyObj(object);
    for (const prop in query) {
        if (prop in update_dict_1.updateDictionary) {
            // @ts-ignore
            update_dict_1.updateDictionary[prop](target)(query[prop]);
            // delete query[prop]
        }
        else {
            if (target instanceof Map) {
                target.set(prop, query[prop]);
            }
            else {
                target[prop] = query[prop];
            }
        }
    }
    return target;
};
