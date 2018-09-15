declare module "checkers" {
    export const isObject: (x: any) => boolean;
    export const isArray: (arg: any) => arg is any[];
}
declare module "distionaries/condition.dict" {
    export interface Conditionable {
        [key: string]: ConditionQuery | string | symbol | number;
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
    }
    export const conditionDictionary: {
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
    };
}
declare module "distionaries/array.dict" {
    export interface Arrayable {
        [key: string]: ArrayQuery | string | symbol | number;
    }
    export interface ArrayQuery {
        $each: any[];
    }
    export const arrayDictionary: {
        $each: <T>(target: T[]) => (items?: T[]) => T[];
    };
}
declare module "distionaries/update.dict" {
    import { ObjectLit } from "index";
    import { ConditionQuery, Conditionable } from "distionaries/condition.dict";
    import { ArrayQuery, Arrayable } from "distionaries/array.dict";
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
    export const dictionary: {
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
}
declare module "index" {
    import { ObjectLit } from "index";
    import { UpdateQuery } from "distionaries/update.dict";
    export interface ObjectLit {
        [key: string]: any;
    }
    export const exception: (message?: string | undefined, ...optionalParams: any[]) => void;
    export const throwError: () => never;
    export const update: <T extends ObjectLit>(object: T, query: UpdateQuery) => T;
}
