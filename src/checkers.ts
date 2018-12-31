import { getVal } from "./helpers/changers";

export const isObject = (x: any) => typeof x === "object"
export const isArray = Array.isArray

export function compare<A, B>(a: A, b: B | A): boolean {
  let verdict: boolean = true
  if(typeof a !== typeof b) verdict = false
  else if(isArray(a) && isArray(b)) {
    for(const x of a) {
      verdict = Boolean(b.find(compare.bind({}, x)))
    }
  } else if(typeof a === "object") {
    if(a instanceof Map && b instanceof Map) {
      for(const [k, v] of a) {
        if(!verdict) break
        verdict = b.has(k) && b.get(k) === v 
      }
    } else if (a instanceof Set && b instanceof Set) {
      for(const v of a) {
        if(!verdict) break
        verdict = b.has(v)
      }
    } else if (a instanceof Object && b instanceof Object) {
      for(const k in a) {
        if(!verdict) break
        const va = getVal(a, k)
        const vb = getVal(b, k)
        // @ts-ignore
        verdict = typeof getVal(b, k) !== "undefined" && compare(va, vb) //|| compare(vb, va)
      }
    }
  } else if (typeof a === typeof b) {
    verdict = a === b
  }

  return verdict
}