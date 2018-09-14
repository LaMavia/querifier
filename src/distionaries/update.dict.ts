import { ObjectLit, exception, throwError } from "..";
import { isArray } from "../checkers";
import { conditionDictionary, ConditionQuery, Conditionable } from "./condition.dict";

export interface UpdateQuery {
  [key: string]: any
  $set?: ObjectLit
  $inc?: ObjectLit
  $min?: ObjectLit
  $max?: ObjectLit
  $mul?: ObjectLit
  $rename?: ObjectLit
  $unset?: ObjectLit 
  $addToSet?: ObjectLit
  $pull?: Conditionable
}

export const dictionary = {
  $set: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for (const prop in obj) {
      if(typeof target[prop] !== typeof obj[prop]) {
        exception(`[$set]> typeof target[${prop}] doesn't match typeof query[${prop}]`)
        continue
      }

      // Watchout for readonly props
      try {
        target[prop] = obj[prop]
      }
      catch(e) {
        exception(`[$set]> Error setting value of target[${prop}]: "${e}"`)
      }
    }

    return target
  },

  $inc: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      if(typeof obj[prop] !== "number" || obj[prop] === NaN) {
        exception(`[$inc]> query[${prop}] is not a number`)
        continue
      }
      if(typeof target[prop] !== "number" || target[prop] === NaN) {
        exception(`[$inc]> target[${prop}] is not a number`)
        continue
      }

      try {
        target[prop] = (target[prop] || 0) + (obj[prop] || 0)
      } 
      catch (e) {
        exception(`[$inc]> Error incrementing target[${prop}]`)
      }
    }
    
    return target
  },

  $min: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      try {
        target[prop] = obj[prop] < target[prop]
          ? obj[prop]
          : target[prop]
      } 
      catch (e) {
        exception(`[$min]> Error setting target[${prop}]`)
      }
    }
    
    return target
  },

  $max: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      try {
        target[prop] = obj[prop] > target[prop]
          ? obj[prop]
          : target[prop]
      } 
      catch (e) {
        exception(`[$max]> Error setting target[${prop}]`)
      }
    }
    
    return target
  },

  $mul: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      if(typeof obj[prop] !== "number" || obj[prop] === NaN) {
        exception(`[$mul]> query[${prop}] is not a number`)
        continue
      }
      if(typeof target[prop] !== "number" || target[prop] === NaN) {
        exception(`[$mul]> target[${prop}] is not a number`)
        continue
      }

      try {
        target[prop] = target[prop]
          ? target[prop] * (obj[prop] || 1)
          : 0
      } 
      catch (e) {
        exception(`[$mul]> Error multiplying target[${prop}]`)
      }
    }
    
    return target
  },

  $rename: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
  ) => {
    const validsKeys = ["symbol", "string", "number"]
    for (const oldKey in obj) {
      let val
      const newKey = obj[oldKey]
      if (!validsKeys.some(x => x === typeof newKey) || !newKey) {
        exception(`[$rename]> ${obj[oldKey]} isn't a valid key`)
        continue
      }
      if (target[oldKey]) {
        val = target[oldKey]
        delete target[oldKey]
      }
      Object.assign(target, { [newKey]: val })
    }

    return target
  },

  $unset: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
  ) => {
    for(const key in obj) (key in target)&& delete target[key]
    return target
  },

  $addToSet: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
		for (const prop in obj) {
			if (!isArray(target[prop])) {
				exception(`[$addToSet]> "${prop}" is not an array`)
				continue
			}
      
      const valid = isArray(obj[prop])
        ? obj[prop].filter((toAdd: any) => !target[prop].some((x: any) => x === toAdd))
        : ( 
          target[prop].some((x: any) => x === obj[prop])
            ? null
            : obj[prop]
        )

			valid&& (target[prop] as any[]).push(valid)
		}
		return target
  },

  $pull: <T extends ObjectLit>(target: T) => (
		query: ObjectLit & ConditionQuery = throwError()
	) => {
    for(const arrayName in query) {
      let array = target[arrayName] as any[]
      if (!isArray(array)) {
				exception(`[$pull]> "${arrayName}" is not an array`)
				continue
      }

      if(typeof query[arrayName] === "object") {
        for(const condition in query[arrayName]) {
          if(condition in conditionDictionary) {
            array = array.filter(x =>
              // @ts-ignore
              !conditionDictionary[condition](query[arrayName][condition])(x)
            )
          }
          else {
            array = array.filter(x => x !== condition)
          }
        }
      } else {
        array = array.filter(x => x !== query[arrayName])
      }

      try {
        target[arrayName] = array
      } catch (e) {
        exception(`[$pull]> Error setting value of ${arrayName}`)
      }
    }

    return target
  }
}