"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_dict_1 = require("./distionaries/update.dict");
exports.exception = console.exception || console.error;
exports.throwError = () => {
    throw new Error('Missing parameter');
};
exports.update = (object, query) => {
    const target = JSON.parse(JSON.stringify(object));
    for (const prop in query) {
        if (prop in update_dict_1.dictionary) {
            const args = [];
            args.push(query[prop]);
            delete query[prop];
            // @ts-ignore
            update_dict_1.dictionary[prop](target)(...args);
        }
        else {
            target[prop] = query[prop];
        }
    }
    return target;
};
exports.default = {
    update: exports.update
};
