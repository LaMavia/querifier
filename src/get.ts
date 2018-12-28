import { ConditionQuery, ConditionSettings, conditionDictionary, conditionSettings } from "./distionaries/condition.dict";
import { ObjectLit } from ".";
import { copyObj } from "./helpers/copy";
import { isArray } from "./checkers";
import { arrayify } from "./helpers/arayify";
export function get<T extends ObjectLit, K extends keyof T, MT>(
	object: T,
	query: {[Key in K]: ConditionQuery},
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
		for (const q in query[prop]) {
			if (q in conditionDictionary && prop in target) {
				const f = conditionDictionary[q](query[prop][q])
				output = (output.concat(
					(isArray(target[prop])
						? target[prop]
						: arrayify(target[prop], sts.$mapper)
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