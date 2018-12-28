import { ConditionQuery, ConditionSettings } from "./distionaries/condition.dict";
import { ObjectLit } from ".";
export declare function get<T extends ObjectLit, K extends keyof T, MT>(object: T, query: {
    [Key in K]: ConditionQuery;
}, settings?: Partial<ConditionSettings<MT>>): (MT extends any ? T[K][keyof T[K]] : MT)[];
