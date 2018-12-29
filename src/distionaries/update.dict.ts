import { ObjectLit, exception, throwError } from "../index";
import { isArray, isObject } from "../checkers";
import { conditionDictionary, ConditionQuery, Conditionable } from "./condition.dict";
import { ArrayQuery, arrayDictionary, Arrayable } from "./array.dict";
import { update } from "../update"
import { set, del, getVal, getPrelastValue, splitKeys } from "../helpers/changers";

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
      if(typeof getVal(target, prop) !== "number" || getVal(target, prop) === NaN) {
        exception(`[$inc]> ${JSON.stringify(target[prop])} is not a number`)
        continue
      }

      try {
        set(target, prop, (getVal(target, prop) || 0) + (obj[prop] || 0))
      } 
      catch (e) {
        exception(`[$inc]> Error incrementing ${JSON.stringify(getVal(target, prop))}`)
      }
    }
    
    return target
  },

  $min: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      try {
        set(target, prop, obj[prop] < getVal(target, prop)
          ? obj[prop]
          : getVal(target, prop))
      } 
      catch (e) {
        exception(`[$min]> Error setting ${getVal(target, prop)}`)
      }
    }
    
    return target
  },

  $max: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      try {
        set(target, prop, obj[prop] > getVal(target, prop)
          ? obj[prop]
          : getVal(target, prop))
      } 
      catch (e) {
        exception(`[$max]> Error setting ${getVal(target, prop)}`)
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
      if(typeof getVal(target, prop) !== "number" || getVal(target, prop) === NaN) {
        exception(`[$mul]> ${JSON.stringify(getVal(target, prop))} is not a number`)
        continue
      }

      try {
        set(target, prop, getVal(target, prop)
          ? getVal(target, prop) * (obj[prop] || 1)
          : 0)
      } 
      catch (e) {
        exception(`[$mul]> Error multiplying target[${prop}] => ${getVal(target, prop)}`)
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
      if (getVal(target, oldKey) !== undefined) {
        val = getVal(target, oldKey)
        del(target, oldKey)
      }
      set(getPrelastValue(target, oldKey), newKey, val)
    }

    return target
  },

  $unset: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
  ) => {
    for(const key in obj) (typeof getVal(target, key) !== 'undefined')&& del(getPrelastValue(target, key), splitKeys(key)[1])
    return target
  },

  $addToSet: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
		for (const prop in obj) {
			if (!isArray(getVal(target, prop))) {
				exception(`[$addToSet]> "${prop}" is not an array`)
				continue
			}
      
      const valid = isArray(obj[prop])
        ? obj[prop].filter((toAdd: any) => !getVal(target, prop).some((x: any) => x === toAdd))
        : ( 
          getVal(target, prop).some((x: any) => x === obj[prop])
            ? null
            : obj[prop]
        )

			valid&& (getVal(target, prop) as any[]).push(valid)
		}
		return target
  },

  $pull: <T extends ObjectLit>(target: T) => (
		query: ObjectLit & ConditionQuery = throwError()
	) => {
    for(const arrayName in query) {
      let array = getVal(target, arrayName) as any[]
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
      const array = getVal(target, key) as any[]
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
      let array = getVal(target, key)// [...target[key]] as any[]
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
        set(target, key, array)
      } catch (e) {
        exception(`[$push]> Error setting value of "${key}"`)
      }
    }

    return target
  },

  $each: <T extends ObjectLit>(target: T) => (query: {[arrayName: string]: UpdateQuery}) => {
    debugger
    for(const arrn in query) {
      const t = getVal(target, arrn)
      if (t && isArray(t)) {
        for(const i in t as ObjectLit[]) {
          const obj = t[i]
          if(isObject(obj)) {
            set(getVal(target, arrn), i, update(obj, query[arrn]))
          }
        }
      }
    }
    return target
  },
}