import { dictionary, UpdateQuery } from "./distionaries/update.dict";
import { copyObj } from "./helpers/copy";
import { ObjectLit } from ".";

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
			// delete query[prop]
		} else {
			target[prop] = query[prop]
		}
	}

	return target
}