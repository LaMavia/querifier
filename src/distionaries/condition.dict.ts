import { throwError, exception, ObjectLit } from "../index";
import { isArray } from "../checkers"

export type ConditionableValue = ConditionQuery | string | symbol | number

export interface Conditionable {
  [key: string]: ConditionableValue
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
}

export const conditionDictionary = {
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
    return conditions.some(con => item === con)
  },
  $nin: <T>(conditions: T[] = throwError()) => (item: T) => {
    if(!isArray(conditions)) {
      exception(`[$in]> "${JSON.stringify(conditions)} is not an array"`)
      return true
    }
    return !conditions.some(con => item === con)
  },

  $and: <T>(conditionQ: ConditionQuery[]) => (item: T): boolean => 
    conditionQ.every(condition => {
      for(const key in condition) {
        if(key in conditionDictionary) {
          // @ts-ignore
          if(!conditionDictionary[key](condition[key])(item)) return false
        } else {
          return item === condition[key]
        }
      }
      return true
    }),

  $or: <T>(conditionQ: ConditionQuery[]) => (item: T): boolean => 
    conditionQ.some(condition => {
      for(const key in condition) {
        if(key in conditionDictionary) {
          // @ts-ignore
          if(!conditionDictionary[key](condition[key])(item)) return false
        } else {
          return item === condition[key]
        }
      }
      return true
    }),

  $not: <T>(condition: ConditionQuery | ConditionableValue) => (item: T): boolean => {
    if(typeof condition === "object") {
      for(const key in condition) {
        if(key in conditionDictionary) {
          // @ts-ignore
          return !conditionDictionary[key](condition[key])(item)
        } else {
          return !(item === condition[key])
        }
      }
    } else {
      // @ts-ignore
      return !(condition === item)
    }

    return true
  },

  $type: <T>(type: string) => (item: T): boolean => 
    type === "array"
      ? isArray(item)
      : typeof item === type
  
}