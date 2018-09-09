import { isObject, isArray } from './checkers'

export interface ObjectLit {
	[key: string]: any
}

export const exception = console.exception || console.error

export const throwError = () => {
	throw new Error('Missing parameter')
}
