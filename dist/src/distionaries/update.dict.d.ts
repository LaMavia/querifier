import { ObjectLit } from "../index";
import { ConditionQuery } from "./condition.dict";
import { ArrayQuery } from "./array.dict";
declare type TaT<T> = T | T[];
export interface UpdateQuery {
    [key: string]: unknown;
    $set?: ObjectLit;
    $inc?: ObjectLit;
    $min?: ObjectLit;
    $max?: ObjectLit;
    $mul?: ObjectLit;
    $rename?: ObjectLit;
    $unset?: ObjectLit;
    $addToSet?: ObjectLit;
    $pull?: {
        [k: string]: ConditionQuery | number | string | ObjectLit;
    };
    $pop?: {
        [key: string]: number;
    };
    $push?: {
        [key: string]: ArrayQuery | TaT<number> | TaT<string>;
    };
    $each?: {
        [arrayName: string]: UpdateQuery;
    };
}
export interface UpdateDictionary {
    [key: string]: <T extends ObjectLit>(target: T) => (params: ObjectLit & ArrayQuery | any) => T;
}
export declare const updateDictionary: UpdateDictionary;
export {};
