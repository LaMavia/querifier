import { UpdateQuery } from "../distionaries/update.dict";
import { ConditionQuery } from "../distionaries/condition.dict";

export function natifyUpdate(query: UpdateQuery): UpdateQuery {
  const nativeq = [
    "$set",
    "$inc",
    "$min",
    "$max",
    "$mul",
    "$rename",
    "$unset",
    "$addToSet",
    "$pull",
    "$pop",
    "$push"
  ]

  const outq: UpdateQuery = {}
  for(const key in query) {
    if(nativeq.find(x => x === key)) {
      outq[key] = query[key]
    } else if(typeof query[key] === "object") {
      outq[key] = natifyCondition(query[key] as ConditionQuery)
    }
  }

  return outq
}

export function natifyCondition(query: ConditionQuery) {
  const nativeq = [
    "$eq",
    "$ne",
    "$gt",
    "$gte",
    "$lt",
    "$lte",
    "$in",
    "$nin",
    "$and",
    "$or",
    "$not",
    "$match"
  ]

  const outq: ConditionQuery = {}
  for(const key in query) {
    if(nativeq.find(x => x === key)) {
      outq[key] = query[key]
    }
  }
  return outq
}