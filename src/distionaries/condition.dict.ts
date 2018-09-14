import { throwError, exception, ObjectLit } from "..";
import { isArray } from "../checkers";

export interface Conditionable {
  [key: string]: ConditionQuery | string | symbol | number
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

}