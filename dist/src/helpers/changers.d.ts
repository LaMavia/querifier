import { ObjectLit } from "..";
export declare type Keys<T> = T extends Map<infer K, unknown> ? K : keyof T;
export declare type Vals<T> = T extends Map<unknown, infer V> ? V : T[keyof T];
/**
 * Returns a tuple of: [Rest of the keys, Last key]
 * @param keys
 * @returns [string, string]
 */
export declare function splitKeys(...keys: string[]): [string, string];
/**
 * Sets a value of either a Map, Object or a Set. May throw an error if the target is either immutable, sealed or frozen.
 * @param {Object | Map | Set} target
 * @param {String | Number | Symbol} key
 * @param {any} value
 */
export declare function set<T extends ObjectLit, K = Keys<T>>(target: T, key: K, value: T[K & string] | Vals<T>): T;
export declare function del<T extends ObjectLit, K = Keys<T>>(target: T, key: K): T;
export declare function getVal<T extends ObjectLit, K = Keys<T>>(target: T, ...keys: K[]): any;
export declare function getPrelastValue<T extends ObjectLit, K = Keys<T>>(target: T, ...keys: K[]): any;
