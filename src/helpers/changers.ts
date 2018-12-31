import { ObjectLit } from ".."
import { isArray } from "../checkers"

export type Keys<T> = T extends Map<infer K, unknown> ? K : keyof T

export type Vals<T> = T extends Map<unknown, infer V> ? V : T[keyof T]

/**
 * Returns a tuple of: [Rest of the keys, Last key]
 * @param keys 
 * @returns [string, string]
 */
export function splitKeys(...keys: string[]): [string, string] {
	const matched = keys.join(".").match(/(.*)*\.([\w\d]*)$/) as string[]
	try {
		return [matched[1], matched.length > 2 ? matched[2] : '']
	} catch (err) {
		console.error(`[<HELPER> splitKeys]> Error splitting "${keys}"`)
		return [keys.splice(0, keys.length - 2).join('.'), keys[keys.length - 1]]
	}
}

/**
 * Sets a value of either a Map, Object or a Set. May throw an error if the target is either immutable, sealed or frozen.
 * @param {Object | Map | Set} target
 * @param {String | Number | Symbol} key
 * @param {any} value
 */
export function set<T extends ObjectLit, K = Keys<T>>(
	target: T,
	key: K,
	value: T[K & string] | Vals<T>
): T {
	const t = getPrelastValue(target, key)
	const [_, p] = splitKeys(key as any)

	if (t instanceof Map) {
		t.set(p, value)
	} else if (t instanceof Set) {
		t.add(value)
	} else {
		t[isNaN(+p) || p !== String(+p) ? p : +p] = value
	}

	return target
}

export function del<T extends ObjectLit, K = Keys<T>>(
	target: T,
	key: K
): T {
	const t = getPrelastValue(target, key)
	const [_, p] = splitKeys(key as any)
	if (t instanceof Map) {
		t.delete(p)
	} else if (target instanceof Set) {
		t.delete(p)
	} else {
		delete t[p]
	}

	return target
}

export function getVal<T extends ObjectLit, K = Keys<T>>(
	target: T,
	...keys: K[]
): any {
	// Check if it's not just a weird key
	let lastVal = target[keys[0] as any] || target
	let s = target[keys[0] as any] ? 1 : 0
	for (const key of keys.slice(s).reduce(
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
	const [k, _] = splitKeys(...keys as any[])
	return getVal(target, k)
} 
