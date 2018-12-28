
import { dictionary, UpdateQuery } from "./distionaries/update.dict"

import {
	HighConditionQuery,
} from "./distionaries/condition.dict"
import { isArray } from "./checkers"
import { arrayify } from "./helpers/arayify"
import { copyObj } from "./helpers/copy";
import { natifyCondition as _nc, natifyUpdate as _nu } from "./helpers/nativfy"

import { get } from "./get"
import { update } from "./update"

export interface ObjectLit {
	[key: string]: any | any[]
}

export const exception = console.exception || console.error

export const natifyCondition = _nc
export const natifyUpdate = _nu

export const throwError = () => {
	throw new Error("[Querifier] Missing parameter")
}

export default {
	update,
	get,
	natifyUpdate,
	natifyCondition
}
