import { ObjectLit } from "..";
import { isArray } from "../checkers";

export interface RONArr<T> extends ReadonlyArray<T | RONArr<T>> {}
interface nArr<T> extends Array<T | Array<T>> {}
export function copyArray<T = any>(arr: nArr<T>): nArr<T> {
  const out: nArr<T> = []
  for(const x of arr) {
    if(isArray(x)) {
      // @ts-ignore
      out.push(copyArray(x))
    } else if(typeof x === "object") {
      out.push(copyObj(x))
    } else {
      out.push(x)
    }
  }
  return out
}

export function copyObj<T = ObjectLit>(obj: T): T {
  const out: T = {} as T
  for(const prop in obj) {
    const x = obj[prop]
    if(isArray(obj[prop])) {
      // @ts-ignore
      out[prop] = copyArray(x)
    } else if(typeof copyObj === "object") {
      out[prop] = copyObj(x)
    } else {
      out[prop] = obj[prop]
    }
  }
  return out
}