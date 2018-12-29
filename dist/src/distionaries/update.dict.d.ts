import { ObjectLit } from "../index";
import { ConditionQuery } from "./condition.dict";
import { ArrayQuery, Arrayable } from "./array.dict";
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
    $pull?: ConditionQuery;
    $pop?: {
        [key: string]: number;
    };
    $push?: Arrayable;
    $each?: {
        [arrayName: string]: UpdateQuery;
    };
}
export interface UpdateDictionary {
    [key: string]: <T extends ObjectLit>(target: T) => (params: ObjectLit | ObjectLit & ArrayQuery | any) => T;
}
export declare const updateDictionary: UpdateDictionary;
