import { UpdateQuery as _UQ } from "./distionaries/update.dict";
import { HighConditionQuery as _HCQ, ConditionSettings as _CS } from "./distionaries/condition.dict";
import { natifyCondition as _nc, natifyUpdate as _nu } from "./helpers/nativfy";
export interface ObjectLit {
    [key: string]: any | any[];
}
export declare type UpdateQuery = _UQ;
export declare type HighConditionQuery = _HCQ;
export declare type ConditionSettings = _CS;
export declare const exception: (message?: string | undefined, ...optionalParams: any[]) => void;
export declare const natifyCondition: typeof _nc;
export declare const natifyUpdate: typeof _nu;
export declare const throwError: () => never;
/**
 * Not-mutating update function. Returns updated object
 * @param object
 * @param query
 */
export declare const update: <T extends ObjectLit>(object: T, query: _UQ) => T;
export declare const get: <T extends ObjectLit>(object: T, query: _HCQ, settings?: _CS) => any[];
declare const _default: {
    update: <T extends ObjectLit>(object: T, query: _UQ) => T;
    get: <T extends ObjectLit>(object: T, query: _HCQ, settings?: _CS) => any[];
    natifyUpdate: typeof _nu;
    natifyCondition: typeof _nc;
};
export default _default;
