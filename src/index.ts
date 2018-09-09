import { isObject, isArray } from './checkers'

export interface ObjectLit {
	[key: string]: any
}

export interface Query {
  [key: string]: any
  $addToSet?: ObjectLit
  $set?: ObjectLit
  $inc?: ObjectLit
  $min?: ObjectLit
  $max?: ObjectLit
  $mul?: ObjectLit
}

export const exception = console.exception || console.error

export const throwError = () => {
	throw new Error('Missing parameter')
}
