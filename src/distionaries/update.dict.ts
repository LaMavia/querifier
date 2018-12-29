import { ObjectLit, exception, throwError } from "../index";
import { isArray, isObject } from "../checkers";
import { conditionDictionary, ConditionQuery, Conditionable } from "./condition.dict";
import { ArrayQuery, arrayDictionary, Arrayable } from "./array.dict";
import { update } from "../update"
import { set, del, getVal } from "../helpers/changers";

export interface UpdateQuery {
  [key: string]: unknown
  $set?: ObjectLit
  $inc?: ObjectLit
  $min?: ObjectLit
  $max?: ObjectLit
  $mul?: ObjectLit
  $rename?: ObjectLit
  $unset?: ObjectLit 
  $addToSet?: ObjectLit
  $pull?: ConditionQuery
  $pop?: {[key: string]: number}
  $push?: Arrayable
  $each?: {[arrayName: string]: UpdateQuery}
}

export interface UpdateDictionary {
  [key: string]: <T extends ObjectLit>(target: T) 
    => (params: ObjectLit | ObjectLit & ArrayQuery | any) => T
}

export const updateDictionary: UpdateDictionary = {
  $set: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for (const prop in obj) {
      if(typeof getVal(target, prop) !== typeof obj[prop]) {
        exception(`[$set]> typeof ${JSON.stringify(target[prop])} doesn't match typeof ${JSON.stringify(obj[prop])}`)
        continue
      }

      // Watchout for readonly props
      try {
        set(target, prop, obj[prop])
      }
      catch(e) {
        exception(`[$set]> Error setting value of ${JSON.stringify(target[prop])}: "${e}"`)
      }
    }

    return target
  },

  $inc: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      if(typeof obj[prop] !== "number" || obj[prop] === NaN) {
        exception(`[$inc]> ${JSON.stringify(obj[prop])} is not a number`)
        continue
      }
      if(typeof target[prop] !== "number" || target[prop] === NaN) {
        exception(`[$inc]> ${JSON.stringify(target[prop])} is not a number`)
        continue
      }

      try {
        set(target, prop, (target[prop] || 0) + (obj[prop] || 0))
      } 
      catch (e) {
        exception(`[$inc]> Error incrementing ${JSON.stringify(target[prop])}`)
      }
    }
    
    return target
  },

  $min: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      try {
        set(target, prop, obj[prop] < target[prop]
          ? obj[prop]
          : target[prop])
      } 
      catch (e) {
        exception(`[$min]> Error setting ${target[prop]}`)
      }
    }
    
    return target
  },

  $max: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      try {
        set(target, prop, obj[prop] > target[prop]
          ? obj[prop]
          : target[prop])
      } 
      catch (e) {
        exception(`[$max]> Error setting ${target[prop]}`)
      }
    }
    
    return target
  },

  $mul: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      if(typeof obj[prop] !== "number" || obj[prop] === NaN) {
        exception(`[$mul]> ${JSON.stringify(obj[prop])} is not a number`)
        continue
      }
      if(typeof target[prop] !== "number" || target[prop] === NaN) {
        exception(`[$mul]> ${JSON.stringify(target[prop])} is not a number`)
        continue
      }

      try {
        set(target, prop, target[prop]
          ? target[prop] * (obj[prop] || 1)
          : 0)
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
        del(target, oldKey)
      }
      set(target, newKey, val)
    }

    return target
  },

  $unset: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
  ) => {
    for(const key in obj) (key in target)&& del(target, key)
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
        set(target, arrayName, array)
      } catch (e) {
        exception(`[$pull]> Error setting value of "${arrayName}"`)
      }
    }

    return target
  },

  $pop: <T extends ObjectLit>(target: T) => (
		query: ObjectLit & ConditionQuery = throwError()
	) => {
    for(const key in query) {
      const array = [...target[key]] as any[]
      if(isArray(array)) {
        switch (query[key]) {
          case -1: array.shift();break;
          case 1: array.pop();break;
          default:;break;
        }
        
        try {
          set(target, key, array)
        } catch (e) {
          exception(`[$pop]> Error setting value of "${key}"`)
        }
      }
    }

    return target
  },

  $push: <T extends ObjectLit>(target: T) => (
		query: ObjectLit & ArrayQuery = throwError()
	) => {
    for(const key in query) {
      let array = target[key]// [...target[key]] as any[]
      if(typeof query[key] === "object") {
        for(const mod in query[key]) {
          if(mod in arrayDictionary) {
            // @ts-ignore
            array = arrayDictionary[mod](array)(query[key][mod]) || array
          } else {
            array.push(query[key][mod])
          }
        }
      } else {
        array.push(query[key])
      }

      try {
        target[key] = array
      } catch (e) {
        exception(`[$push]> Error setting value of "${key}"`)
      }
    }

    return target
  },

  $each: <T extends ObjectLit>(target: T) => (query: {[arrayName: string]: UpdateQuery}) => {
    debugger
    for(const arrn in query) {
      if (target[arrn] && isArray(target[arrn])) {
        for(const i in target[arrn] as ObjectLit[]) {
          const obj = target[arrn][i]
          if(isObject(obj)) {
            set(getVal(target, arrn), i, update(obj, query[arrn]))
          }
        }
      }
    }
    return target
  },
}