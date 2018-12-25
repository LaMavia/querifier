import { ObjectLit } from "../index";
export declare type ConditionableValue = ConditionQuery | string | symbol | number;
export interface Conditionable {
    [key: string]: ConditionableValue;
}
export interface ConditionSettings {
    [key: string]: any;
    $inject?: ObjectLit;
    $sort?: "asc" | "dsc";
    $mapper?: (x: any) => any;
}
export declare const conditionSettings: {
    [key: string]: <T>(target: T & ObjectLit, output: T[]) => (item: any) => T[];
};
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
export declare const conditionDictionary: {
    [key: string]: <T>(condition: any) => (item: T) => boolean;
};
