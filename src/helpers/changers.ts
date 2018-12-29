import { ObjectLit } from ".."
import { isArray } from "../checkers"

/**
 * Sets a value of either a Map, Object or a Set. May throw an error if the target is either immutable, sealed or frozen.
 * @param {Object | Map | Set} target
 * @param {String | Number | Symbol} key
 * @param {any} value
 */
export function set<T extends ObjectLit, K extends keyof T>(
	target: T,
	key: K,
	value: T[K]
): T {
	const t = getPrelastValue(target, key)
	let p // Last key
	if(typeof key === 'string') {
		const keys = key.split(".")
		p = keys[keys.length - 1]
	} else {
		p = key
	}

	if (t instanceof Map) {
		t.set(p, value)
	} else if (t instanceof Set) {
		t.add(value)
	} else {
		t[p] = value
	}

	return target
}

export function del<T extends ObjectLit, K extends keyof T>(
	target: T,
	key: K
): T {
	if (target instanceof Map) {
		target.delete(key)
	} else if (target instanceof Set) {
		target.delete(key)
	} else {
		delete target[key]
	}

	return target
}

type Keys<T> = T extends Map<unknown, unknown> ? keyof T["entries"] : keyof T
export function getVal<T extends ObjectLit, K = Keys<T>>(
	target: T,
	...keys: K[]
): any {
	let lastVal = target
	for (const key of keys.reduce(
		(acc, k) => acc.concat(typeof k === "string" ? k.split(".") : ([k] as any)),
		[]
	)) {
		let next
		if (lastVal instanceof Map) {
			next = lastVal.get(key)
		} else {
			next = lastVal[key]
		}
		if (typeof next === "undefined" || next === null) break
		else lastVal = next
	}

	return lastVal
}

export function getPrelastValue<T extends ObjectLit, K = Keys<T>>(
	target: T,
	...keys: K[]
): any {
	const matched = keys.join(".").match(/(.*)*\.[\w\d]*$/) as string[]
	return getVal(
		target,
		...((
			matched
				? matched.length > 0 ? matched[1] : matched[0] || ""
				: ''
		).split("."))
	)
}
