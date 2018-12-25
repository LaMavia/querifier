import { ObjectLit } from "..";
export interface RONArr<T> extends ReadonlyArray<T | RONArr<T>> {
}
interface nArr<T> extends Array<T | Array<T>> {
}
export declare function copyArray<T = any>(arr: nArr<T>): nArr<T>;
export declare function copyObj<T = ObjectLit>(obj: T): T;
export {};
