export function arrayify<T, MT>(obj: T, mapper?: (x: unknown) => MT) {
  const output: any[] = []
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
