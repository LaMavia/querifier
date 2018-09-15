define("checkers", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isObject = (x) => typeof x === "object";
    exports.isArray = Array.isArray;
});
define("distionaries/condition.dict", ["require", "exports", "index", "checkers"], function (require, exports, index_1, checkers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
                    const out = exports.conditionDictionary[key](condition[key])(item);
                    if (!out)
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
            }
            return true;
        })
    };
});
define("distionaries/array.dict", ["require", "exports", "index"], function (require, exports, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.arrayDictionary = {
        $each: (target) => (items = index_2.throwError()) => target.concat(items)
    };
});
define("distionaries/update.dict", ["require", "exports", "index", "checkers", "distionaries/condition.dict", "distionaries/array.dict"], function (require, exports, index_3, checkers_2, condition_dict_1, array_dict_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dictionary = {
        $set: (target) => (obj = index_3.throwError()) => {
            for (const prop in obj) {
                if (typeof target[prop] !== typeof obj[prop]) {
                    index_3.exception(`[$set]> typeof target[${prop}] doesn't match typeof query[${prop}]`);
                    continue;
                }
                // Watchout for readonly props
                try {
                    target[prop] = obj[prop];
                }
                catch (e) {
                    index_3.exception(`[$set]> Error setting value of target[${prop}]: "${e}"`);
                }
            }
            return target;
        },
        $inc: (target) => (obj = index_3.throwError()) => {
            for (const prop in obj) {
                if (typeof obj[prop] !== "number" || obj[prop] === NaN) {
                    index_3.exception(`[$inc]> query[${prop}] is not a number`);
                    continue;
                }
                if (typeof target[prop] !== "number" || target[prop] === NaN) {
                    index_3.exception(`[$inc]> target[${prop}] is not a number`);
                    continue;
                }
                try {
                    target[prop] = (target[prop] || 0) + (obj[prop] || 0);
                }
                catch (e) {
                    index_3.exception(`[$inc]> Error incrementing target[${prop}]`);
                }
            }
            return target;
        },
        $min: (target) => (obj = index_3.throwError()) => {
            for (const prop in obj) {
                try {
                    target[prop] = obj[prop] < target[prop]
                        ? obj[prop]
                        : target[prop];
                }
                catch (e) {
                    index_3.exception(`[$min]> Error setting target[${prop}]`);
                }
            }
            return target;
        },
        $max: (target) => (obj = index_3.throwError()) => {
            for (const prop in obj) {
                try {
                    target[prop] = obj[prop] > target[prop]
                        ? obj[prop]
                        : target[prop];
                }
                catch (e) {
                    index_3.exception(`[$max]> Error setting target[${prop}]`);
                }
            }
            return target;
        },
        $mul: (target) => (obj = index_3.throwError()) => {
            for (const prop in obj) {
                if (typeof obj[prop] !== "number" || obj[prop] === NaN) {
                    index_3.exception(`[$mul]> query[${prop}] is not a number`);
                    continue;
                }
                if (typeof target[prop] !== "number" || target[prop] === NaN) {
                    index_3.exception(`[$mul]> target[${prop}] is not a number`);
                    continue;
                }
                try {
                    target[prop] = target[prop]
                        ? target[prop] * (obj[prop] || 1)
                        : 0;
                }
                catch (e) {
                    index_3.exception(`[$mul]> Error multiplying target[${prop}]`);
                }
            }
            return target;
        },
        $rename: (target) => (obj = index_3.throwError()) => {
            const validsKeys = ["symbol", "string", "number"];
            for (const oldKey in obj) {
                let val;
                const newKey = obj[oldKey];
                if (!validsKeys.some(x => x === typeof newKey) || !newKey) {
                    index_3.exception(`[$rename]> ${obj[oldKey]} isn't a valid key`);
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
        $unset: (target) => (obj = index_3.throwError()) => {
            for (const key in obj)
                (key in target) && delete target[key];
            return target;
        },
        $addToSet: (target) => (obj = index_3.throwError()) => {
            for (const prop in obj) {
                if (!checkers_2.isArray(target[prop])) {
                    index_3.exception(`[$addToSet]> "${prop}" is not an array`);
                    continue;
                }
                const valid = checkers_2.isArray(obj[prop])
                    ? obj[prop].filter((toAdd) => !target[prop].some((x) => x === toAdd))
                    : (target[prop].some((x) => x === obj[prop])
                        ? null
                        : obj[prop]);
                valid && target[prop].push(valid);
            }
            return target;
        },
        $pull: (target) => (query = index_3.throwError()) => {
            for (const arrayName in query) {
                let array = target[arrayName];
                if (!checkers_2.isArray(array)) {
                    index_3.exception(`[$pull]> "${arrayName}" is not an array`);
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
                    index_3.exception(`[$pull]> Error setting value of "${arrayName}"`);
                }
            }
            return target;
        },
        $pop: (target) => (query = index_3.throwError()) => {
            for (const key in query) {
                const array = [...target[key]];
                if (checkers_2.isArray(array)) {
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
                        index_3.exception(`[$pop]> Error setting value of "${key}"`);
                    }
                }
            }
            return target;
        },
        $push: (target) => (query = index_3.throwError()) => {
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
                    index_3.exception(`[$push]> Error setting value of "${key}"`);
                }
            }
            return target;
        }
    };
});
define("index", ["require", "exports", "distionaries/update.dict"], function (require, exports, update_dict_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
});
