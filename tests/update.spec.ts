import { update } from "../src/update"

describe('$addToSet', () => {
  it("Adds 1 to an array", () => {
    const o = {
      arr: [0]
    }
    expect(update(o, { $addToSet: { arr: 1 } }).arr).toEqual([0, 1])
  })

  it("Adds an array to an array", () => {
    const o = {
      arr: [0]
    }
    expect(update(o, { $addToSet: { arr: [1, 2] } }).arr).toEqual([0, [1, 2]])
  })

  it("Adds to multiple arrays", () => {
    const o = {
      arr1: [],
      arr2: []
    }
    expect(update(o, { $addToSet: { arr1: 1, arr2: 2 } })).toEqual({ arr1: [1], arr2: [2] })
    // @ts-ignore
    // expect(update(o, { $addToSet: { arr1: 1 }, $addToSet: { arr2: 2 } })).toEqual({ arr1: [1], arr2: [2] })
  })

  it("Doesn't change on number", () => {
    const fo = {
      notArray: 1
    }
    expect(update(fo, { $addToSet: { notArray: 2 } }).notArray).toBe(1)
  })

  it("Doesn't change on object", () => {
    const fo = {
      notArray: {a: 1}
    }
    expect(update(fo, { $addToSet: { notArray: 2 } }).notArray).toEqual({a: 1})
  })

  it("Doesn't mutate the target", () => {
    const o = {a: []};
    update(o, { $addToSet: { a: 1 } })
    expect(o.a).toEqual([])
  })
})
 

describe("$set", () => {
  it("Sets 0 to 1", () => {
    const o = {
      a: 0
    }
    expect(update(o, { $set: { a: 1 } }).a).toBe(1)
  })

  it("Sets multiple values", () => {
    const o = {
      a: 1,
      b: [1, 2, 3]
    }
    expect(update(o, { $set: { a: 2, b: [4, 5, 6] } })).toEqual({a: 2, b: [4, 5, 6]})
  })

  it("Doesn't set when types don't match", () => {
    const o = {
      a: 1 // number
    }
    expect(update(o, { $set: { a: "I'm a string!" } }).a).toBe(1)
  })

  it("Doesn't mutate the target", () => {
    const o = {a: 0};
    update(o, { $set: { a: 1 } })
    expect(o.a).toBe(0)
  })
})

describe("$inc", () => {
  it("Increments target's prop", () => {
    const o = {a: 1}
    expect(update(o, { $inc: { a: 2 } }).a).toBe(3)
  })

  it("Accepts negative numbers", () => {
    const o = {a: 2}
    expect(update(o, { $inc: { a: -2 } }).a).toBe(0)
  })

  it("Doesn't change when called with NaN", () => {
    const o = {a: 2}
    expect(update(o, { $inc: { a: "String here" } }).a).toBe(2)
    expect(update(o, { $inc: { a: {} } }).a).toBe(2)
    expect(update(o, { $inc: { a: NaN } }).a).toBe(2)
    expect(update(o, { $inc: { a: "String" } }).a).toBe(2)
    expect(update(o, { $inc: { a: [] } }).a).toBe(2)
  })

  it("Doesn't mutate the target", () => {
    const o = {a: 0};
    update(o, { $inc: { a: 1 } })
    expect(o.a).toBe(0)
  })
})

describe("$min", () => {
  it("Changes when called with smaller value", () => {
    const o = {a: 20}
    expect(update(o, { $min: { a: 10 } }).a).toBe(10)
  })

  it("Doesn't change when called with bigger value", () => {
    const o = {a: 20}
    expect(update(o, { $min: { a: 30 } }).a).toBe(20)
  })

  it("Doesn't mutate the target", () => {
    const o = {a: 43};
    update(o, { $min: { a: 1 } })
    expect(o.a).toBe(43)
  })
})

describe("$max", () => {
  it("Changes when called with bigger value", () => {
    const o = {a: 20}
    expect(update(o, { $max: { a: 30 } }).a).toBe(30)
  })

  it("Doesn't change when called with smaller value", () => {
    const o = {a: 20}
    expect(update(o, { $max: { a: 10 } }).a).toBe(20)
  })

  it("Doesn't mutate the target", () => {
    const o = {a: 43};
    update(o, { $max: { a: 50 } })
    expect(o.a).toBe(43)
  })
})

/**
 * @TODO add the test
 */
describe("$mul", () => {
  it("Multiplies target's prop", () => {
    const o = {a: 1}
    expect(update(o, { $mul: { a: 2 } }).a).toBe(2)
  })

  it("Accepts negative numbers", () => {
    const o = {a: 2}
    expect(update(o, { $mul: { a: -2 } }).a).toBe(-4)
  })

  it("Doesn't change when called with NaN", () => {
    const o = {a: 2}
    expect(update(o, { $mul: { a: "String here" } }).a).toBe(2)
    expect(update(o, { $mul: { a: {} } }).a).toBe(2)
    expect(update(o, { $mul: { a: NaN } }).a).toBe(2)
    expect(update(o, { $mul: { a: "String" } }).a).toBe(2)
    expect(update(o, { $mul: { a: [] } }).a).toBe(2)
  })

  it("Doesn't mutate the target", () => {
    const o = {a: 0};
    update(o, { $inc: { a: 1 } })
    expect(o.a).toBe(0)
  })
})

describe("$rename", () => {
  it("Changes the key", () => {
    const o = {oldKey: 2}
    expect(update(o, { $rename: { oldKey: "newKey" } })).toEqual({ newKey: 2 })
  })

  it("Doesn't accept invalid keys", () => {
    const o = {a: 1}
    expect(update(o, { $rename: {a: () => {}} })).toEqual({a: 1})
    expect(update(o, { $rename: {a: undefined} })).toEqual({a: 1})
    expect(update(o, { $rename: {a: null} })).toEqual({a: 1})
    expect(update(o, { $rename: {a: []} })).toEqual({a: 1})
  })

  it("Doesn't mutate the target", () => {
    const o = {a: 0};
    update(o, { $rename: { a: 'b' } })
    expect(o.a).toBe(0)
    // @ts-ignore
    expect(o.b).toBeUndefined()
  })
}) 

describe("$unset", () => {
  it("Deletes defined prop", () => {
    const o = {a: 1}
    expect(update(o, { $unset: { a: 0 } })).toEqual({})
  })

  it("Doesn't fail when prop is undefined", () => {
    const o = {}
    expect(update(o, { $unset: { a: 0 } })).toEqual({})
  })

  it("Doesn't mutate the target", () => {
    const o = {a: 0};
    update(o, { $unset: { a: '' } })
    expect(o.a).toBe(0)
  })
})

