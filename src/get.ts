import { ConditionQuery, ConditionSettings, conditionDictionary, conditionSettings } from "./distionaries/condition.dict";
import { ObjectLit, exception } from ".";
import { copyObj } from "./helpers/copy";
import { isArray } from "./checkers";
import { arrayify } from "./helpers/arayify";
import { getVal } from "./helpers/changers";
export function get<T extends ObjectLit, K extends keyof T, MT>(
	object: T,
	query: {[Key in K]: ConditionQuery} = {} as any,
	settings: Partial<ConditionSettings<MT>> = {}
) {
	const target = copyObj(object)
	const sts: ConditionSettings<MT> = {
		...settings,
		$sort: settings.$sort || "asc",
		$mapper: settings.$mapper || (x => x)
	}

	let output: MT[] = []
	for (const prop in query) {
		// Push every collection without conditions in query 
		const arr = prop in target
			? arrayify(getVal(target, prop))
			: []
		if(Object.keys(query[prop]).length === 0) 
			output = output.concat(arr)
		// Push collections filtered by conditions from the query
		if(!(prop in target)) {
			exception(`[get]> Collection "${prop}" doesn't exist in the target "${JSON.stringify(target, null, 2).replace(/\[\s(^\s+[\d(?:"\w+\s\w")]+,?\s)+/gmi, "...")}`)
			continue
		}
		for (const q in query[prop]) {
			if (q in conditionDictionary && prop in target) {
				const f = conditionDictionary[q](getVal(query, prop, q as any)) ; // query[prop][q]
				output = (output.concat(
					(isArray(target[prop])
						? getVal(target, prop)
						: arrayify(getVal(target, prop), sts.$mapper)
					) as T[K]).filter(f || (() => true))
				)
				delete query[prop][q]
			}
		}
		delete query[prop]
	}
	for (const key in sts) {
		if (key in conditionSettings && key !== '$mapper') {
			output = conditionSettings[key](target, output as T[K][])(sts[key])
		}
	}
	type Ret<T, K extends keyof T> = 
		ReturnType<typeof sts["$mapper"]> extends any 
			? T[K][keyof T[K]] 
			: MT
	return output as Ret<T, K>[]
}