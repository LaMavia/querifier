import { updateDictionary, UpdateQuery } from "./dictionaries/update.dict"
import { copyObj } from "./helpers/copy"
import { ObjectLit } from "."
import { isArray } from "./checkers"

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
		if (prop in updateDictionary) {
			// @ts-ignore
			updateDictionary[prop](target)(query[prop])
			// delete query[prop]
		} else {
			if (target instanceof Map) {
				target.set(prop, query[prop])
			} else {
				target[prop] = query[prop]
			}
		}
	}
	return target
}
