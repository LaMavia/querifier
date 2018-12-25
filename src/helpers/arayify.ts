export function arrayify<T>(obj: T, mapper?: <A, B>(x: A) => A | B) {
  const output: any[] = []
  // @ts-ignore
  // console.log(`Prototype: ${obj.prototype}\nObj: ${JSON.stringify(obj)}\nInstanceof Map: ${obj instanceof Map}\nInstanceof Set: ${obj instanceof Set}`)
	if(obj instanceof Map || obj instanceof Set) {
    for (const v of obj) {
      output.push(mapper ? mapper(v) : v)
    }
  } else {
    for (const key in obj) {
      output.push(mapper ? mapper(obj[key]) : obj[key])
    }
  }
	return output
}
