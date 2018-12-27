"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function natifyUpdate(query) {
    const nativeq = [
        "$set",
        "$inc",
        "$min",
        "$max",
        "$mul",
        "$rename",
        "$unset",
        "$addToSet",
        "$pull",
        "$pop",
        "$push"
    ];
    const outq = {};
    for (const key in query) {
        if (nativeq.find(x => x === key)) {
            outq[key] = query[key];
        }
        else if (typeof query[key] === "object") {
            outq[key] = natifyCondition(query[key]);
        }
    }
    return outq;
}
exports.natifyUpdate = natifyUpdate;
function natifyCondition(query) {
    const nativeq = [
        "$eq",
        "$ne",
        "$gt",
        "$gte",
        "$lt",
        "$lte",
        "$in",
        "$nin",
        "$and",
        "$or",
        "$not",
        "$match"
    ];
    const outq = {};
    for (const key in query) {
        if (nativeq.find(x => x === key)) {
            outq[key] = query[key];
        }
    }
    return outq;
}
exports.natifyCondition = natifyCondition;
