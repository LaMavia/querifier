import { dictionary, UpdateQuery } from './distionaries/update.dict'

export interface ObjectLit {
	[key: string]: any
}

export const exception = console.exception || console.error

export const throwError = () => {
	throw new Error('Missing parameter')
}

export const update = <T extends ObjectLit>(
	object: T,
	query: UpdateQuery
): T => {
	const target = JSON.parse(JSON.stringify(object))
	for (const prop in query) {
		if (prop in dictionary) {
			const args = []
			args.push(query[prop])
			delete query[prop]
			// @ts-ignore
			dictionary[prop](target)(...args)
		} else {
			target[prop] = query[prop]
		}
	}

	return target
}
export default {
	update
}