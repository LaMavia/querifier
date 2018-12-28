import { ObjectLit } from "../index";
export declare type ConditionableValue = ConditionQuery | string | symbol | number;
export interface Conditionable {
    [key: string]: ConditionableValue;
}
export interface ConditionSettings<MT> {
    [key: string]: any;
    $inject?: ObjectLit;
    $sort: "asc" | "dsc";
    $mapper: (x: any) => MT;
}
interface _ConditionSettings {
    [key: string]: <T extends ObjectLit, K extends keyof T, R>(target: T, output: T[K][]) => (items: any) => T[K][];
}
export declare const conditionSettings: _ConditionSettings;
export interface HighConditionQuery {
    [prop: string]: ConditionQuery;
}
export interface ConditionQuery {
    [key: string]: any;
    $eq?: any;
    $ne?: any;
    $gt?: any;
    $gte?: any;
    $lt?: any;
    $lte?: any;
    $in?: any[];
    $nin?: any[];
    $and?: ConditionQuery[];
    $or?: ConditionQuery[];
    $not?: ConditionQuery | string | symbol | number;
    $type?: "number" | "symbol" | "function" | "object" | "array" | "boolean" | "string" | "undefined";
    $match?: RegExp;
    $exec?: (item: unknown) => boolean;
}
interface ConDict {
    [key: string]: <T>(condition: any) => (item: T) => boolean;
}
export declare const conditionDictionary: ConDict;
export {};
