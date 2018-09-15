export declare type ConditionableValue = ConditionQuery | string | symbol | number;
export interface Conditionable {
    [key: string]: ConditionableValue;
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
}
export declare const conditionDictionary: {
    $eq: <T>(condition?: T) => (item: T) => boolean;
    $ne: <T>(condition?: T) => (item: T) => boolean;
    $gt: <T>(condition?: T) => (item: T) => boolean;
    $gte: <T>(condition?: T) => (item: T) => boolean;
    $lt: <T>(condition?: T) => (item: T) => boolean;
    $lte: <T>(condition?: T) => (item: T) => boolean;
    $in: <T>(conditions?: T[]) => (item: T) => boolean;
    $nin: <T>(conditions?: T[]) => (item: T) => boolean;
    $and: <T>(conditionQ: ConditionQuery[]) => (item: T) => boolean;
    $or: <T>(conditionQ: ConditionQuery[]) => (item: T) => boolean;
    $not: <T>(condition: ConditionableValue) => (item: T) => boolean;
    $type: <T>(type: string) => (item: T) => boolean;
};
