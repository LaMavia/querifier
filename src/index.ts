import { dictionary, UpdateQuery as _UQ } from "./distionaries/update.dict"

import {
	conditionDictionary,
	HighConditionQuery as _HCQ,
	ConditionSettings as _CS,
	conditionSettings,
} from "./distionaries/condition.dict"
import { isArray } from "./checkers"
import { arrayify } from "./helpers/arayify"
import { copyObj } from "./helpers/copy";

export interface ObjectLit {
	[key: string]: any | any[]
}

export type UpdateQuery = _UQ
export type HighConditionQuery = _HCQ
export type ConditionSettings = _CS

export const exception = console.exception || console.error

export const throwError = () => {
	throw new Error("[Querifier] Missing parameter")
}

/**
 * Not-mutating update function. Returns updated object
 * @param object
 * @param query
 */
export const update = <T extends ObjectLit>(
	object: T,
	query: UpdateQuery
): T => {
	const target = copyObj(object)
	for (const prop in query) {
		if (prop in dictionary) {
			// @ts-ignore
			dictionary[prop](target)(query[prop])
			delete query[prop]
		} else {
			target[prop] = query[prop]
		}
	}

	return target
}

export const get = <T extends ObjectLit>(
	object: T,
	query: HighConditionQuery,
	settings: ConditionSettings = {}
) => {
	const target = copyObj(object)
	let output: any[] = []
	for (const prop in query) {
		for (const q in query[prop]) {
			if (q in conditionDictionary && prop in target) {
				const f = conditionDictionary[q](query[prop][q])
				output = output.concat(
					(isArray(target[prop])
						? target[prop]
						: arrayify(target[prop], settings.$mapper || (x => x))
					).filter(f || (() => true))
				)
				delete query[prop][q]
			}
		}
		delete query[prop]
	}
	for (const key in settings) {
		if (key in conditionSettings && key !== '$mapper') {
			output = conditionSettings[key](target, output)(settings[key])
		}
	}

	return output
}

export default {
	update,
	get,
}
