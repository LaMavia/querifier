import { ObjectLit } from "../index";
import { ConditionQuery, Conditionable } from "./condition.dict";
import { ArrayQuery, Arrayable } from "./array.dict";
export interface UpdateQuery {
    [key: string]: any;
    $set?: ObjectLit;
    $inc?: ObjectLit;
    $min?: ObjectLit;
    $max?: ObjectLit;
    $mul?: ObjectLit;
    $rename?: ObjectLit;
    $unset?: ObjectLit;
    $addToSet?: ObjectLit;
    $pull?: Conditionable;
    $pop?: {
        [key: string]: number;
    };
    $push?: Arrayable;
}
export declare const dictionary: {
    $set: <T extends ObjectLit>(target: T) => (obj?: ObjectLit) => T;
    $inc: <T extends ObjectLit>(target: T) => (obj?: ObjectLit) => T;
    $min: <T extends ObjectLit>(target: T) => (obj?: ObjectLit) => T;
    $max: <T extends ObjectLit>(target: T) => (obj?: ObjectLit) => T;
    $mul: <T extends ObjectLit>(target: T) => (obj?: ObjectLit) => T;
    $rename: <T extends ObjectLit>(target: T) => (obj?: ObjectLit) => T;
    $unset: <T extends ObjectLit>(target: T) => (obj?: ObjectLit) => T;
    $addToSet: <T extends ObjectLit>(target: T) => (obj?: ObjectLit) => T;
    $pull: <T extends ObjectLit>(target: T) => (query?: ObjectLit & ConditionQuery) => T;
    $pop: <T extends ObjectLit>(target: T) => (query?: ObjectLit & ConditionQuery) => T;
    $push: <T extends ObjectLit>(target: T) => (query?: ObjectLit & ArrayQuery) => T;
};
