import { throwError, exception, ObjectLit } from "../index";
import { isArray } from "../checkers"

export type ConditionableValue = ConditionQuery | string | symbol | number 

export interface Conditionable {
  [key: string]: ConditionableValue
}
type MapItem<T> =
  T extends Map<string, any> ? [string, any] : T
export interface ConditionSettings<MT> {
  [key: string]: any
  $inject?: ObjectLit
  $sort: "asc" | "dsc"
  $mapper: (x: any) => MT
}

interface _ConditionSettings { 
  [key: string]: <T extends ObjectLit, K extends keyof T, R>(target: T, output: T[K][]) => (items: any) => T[K][]
}

export const conditionSettings: _ConditionSettings = {
  $inject: <T extends ObjectLit, K extends keyof T>(target: T, output: T[K][]) => (items: {[key: string]: boolean}) => {
    for(const key in items) {
      if(items[key]) { 
        output = output.concat(
          isArray(target[key]) 
            ? target[key] 
            : [target[key]]
        )
      }
    }
    return output
  },
  $sort: <T, K extends keyof T>(target: T & ObjectLit, output: T[K][]) => (order: string) => 
    // @ts-ignore
    order === "asc" ? output.sort((a,b) => a-b) : output.slice().reverse(),
  $mapper: <T, K extends keyof T>(target: T & ObjectLit, output: T[K][]) => (callback: (value: T[K], index: number, array: T[K][]) => T[K]) => output.map(callback)
}

export interface HighConditionQuery {
  [prop: string]: ConditionQuery
}

export interface ConditionQuery {
  [key: string]: any
  $eq?:  any
  $ne?:  any
  $gt?:  any
  $gte?: any
  $lt?:  any
  $lte?: any
  $in?:  any[]
  $nin?: any[]

  $and?: ConditionQuery[]
  $or?: ConditionQuery[]
  $not?: ConditionQuery | string | symbol | number

  $type?: "number" | "symbol" | "function" | "object" | "array" | "boolean" | "string" | "undefined"

  $match?: RegExp
  $exec?: (item: unknown) => boolean
}

interface ConDict { 
  [key: string]: <T>(condition: any) 
    => (item: T) 
    => boolean
}

export const conditionDictionary: ConDict = {
  $eq: <T>(condition: T = throwError()) => (item: T) => 
    item === condition,
  $ne: <T>(condition: T = throwError()) => (item: T) => 
    item !== condition,
  $gt: <T>(condition: T = throwError()) => (item: T) => 
    item > condition,
  $gte: <T>(condition: T = throwError()) => (item: T) => 
    item >= condition,
  $lt: <T>(condition: T = throwError()) => (item: T) => 
    item < condition,
  $lte: <T>(condition: T = throwError()) => (item: T) => 
    item <= condition,
  $in: <T>(conditions: T[] = throwError()) => (item: T) => {
    if(!isArray(conditions)) {
      exception(`[$in]> "${JSON.stringify(conditions)} is not an array"`)
      return true
    }
    return conditions.some(con => 
      con instanceof RegExp 
        ? con.test(typeof item === "string" ? item : String(item))
        : item === con
    )
  },
  $nin: <T>(conditions: T[] = throwError()) => (item: T) => {
    if(!isArray(conditions)) {
      exception(`[$in]> "${JSON.stringify(conditions)} is not an array"`)
      return true
    }
    return !conditions.some(con => 
      con instanceof RegExp 
        ? con.test(typeof item === "string" ? item : String(item))
        : item === con
    )
  },

  $and: <T>(conditionQ: ConditionQuery[]) => (item: T): boolean => 
    conditionQ.every(condition => {
      for (const key in condition) {
        // @ts-ignore
        if (key in conditionDictionary && !conditionDictionary[key](condition[key])(item)) return false
        if(!item === condition[key]) return false
      }
      return true
    }),

  $or: <T>(conditionQ: ConditionQuery[]) => (item: T): boolean => 
    conditionQ.some(condition => {
      for(const key in condition) {
        // @ts-ignore
        if(key in conditionDictionary && !conditionDictionary[key](condition[key])(item)) {
          return false
        } else if (!item === condition[key]){
          return false
        }
      }
      return true
    }),

  $not: <T>(condition: ConditionQuery | ConditionableValue) => (item: T): boolean => {
    if (typeof condition === "object") {
      for (const key in condition) {
        if (key in conditionDictionary && 
          // @ts-ignore
          !conditionDictionary[key](condition[key])(item)
        ) {
          return true
        }
        else if (item !== condition[key]) return false
      }
      return false
    }
    // @ts-ignore
    return !(condition === item)

  },

  $type: <T>(type: string) => (item: T): boolean => 
    type === "array"
      ? isArray(item)
      : typeof item === type,
  
  $match: <T>(regexp: RegExp) => (item: T): boolean => 
    // @ts-ignore  
    regexp.test(item),
  
  $exec: (f: (<T>(item: T) => boolean)) => f
}