import { arrayify } from "../src/helpers/arayify";
import { splitKeys, set, del, getVal } from "../src/helpers/changers";

describe("arrayify", () => {
  // basic checks
  const obj = {evens: [0, 2, 4], odds: [1, 3, 5]}
  it("Arrayifies an object with 1lvl deep arrays", () => {
    expect(arrayify(obj)).toEqual([[0, 2, 4], [1, 3, 5]])
  })

  const map = new Map([ ["01", {name: "Bobby"}], ["02", {name: "Jon"}] ])
  it("Arrayifies a map of object", () => {
    expect(arrayify(map)).toEqual([
      ["01", {name: "Bobby"}], ["02", {name: "Jon"}]
    ])
  })

  const set = new Set([{name: "Bobby"}, {name: "Jon"}])
  it("Arrayifies a set of object", () => {
    expect(arrayify(set)).toEqual([{name: "Bobby"}, {name: "Jon"}])
  })

  // Mapper
  it("Passes values of object's properties to the mapper", () => {
    let vs = []
    arrayify(obj, x => (vs.push(x), x))
    expect(vs).toEqual([[0, 2, 4], [1, 3, 5]])
  })

  it("Passes tuples of value and a key of map's keys to the mapper", () => {
    let vs = []
    arrayify(map, x => (vs.push(x), x))
    expect(vs).toEqual([["01", {name: "Bobby"}], ["02", {name: "Jon"}]])
  })

  it("Passes values of sets to the mapper", () => {
    let vs = []
    arrayify(set, x => (vs.push(x), x))
    expect(vs).toEqual([{name: "Bobby"}, {name: "Jon"}])
  })
})

//#region : changers.ts
describe("splitKeys", () => {
  it("Keys w/o dots", () => {
    const keys = ['a', 'b', 'c', 'd']
    expect(splitKeys(keys.join('.'))).toEqual(['a.b.c', 'd'])
  })

  it("Keys with dots", () => {
    const keys =  ['a.b', 'c', 'd.e', 'f']
    expect(splitKeys(...keys)).toEqual(['a.b.c.d.e', 'f'])
  })

  it("Single key", () => {
    const k = "key"
    expect(splitKeys(k)).toEqual(['', k])
  })
})

describe("set", () => {
  let obj = {evens: [0, 2, 4], odds: [1, 3, 5]}
  let map = new Map([ ["01", {name: "Bobby"}], ["02", {name: "Jon"}] ])
  let aset = new Set([{name: "Bobby"}, {name: "Jon"}])

  beforeEach(() => {
    map = new Map([ ["01", {name: "Bobby"}], ["02", {name: "Jon"}] ])
    obj = {evens: [0, 2, 4], odds: [1, 3, 5]}
    aset = new Set([{name: "Bobby"}, {name: "Jon"}])
  })
  //#region Map
  it("Map: mutates", () => {
    set(map, "01", {name: "Jon"})
    expect(map.get("01")).toEqual({name: "Jon"})
  })

  it("Map: normal notation", () => {
    expect(set(map, "01", {name: "Jon"}).get("01")).toEqual({name: "Jon"})
  })

  it("Map: dot notation", () => {
    expect(set(map, "01.name", "Jon").get("01")).toEqual({name: "Jon"})
  })
  //#endregion
  //#region Set 
  it("Set: mutates & normal notation", () => {
    set(aset, "", {name: "Jon"})
    expect(aset.entries()).toEqual(new Set([{name: "Bobby"}, {name: "Jon"}, {name: "Jon"}]).entries())
  })
  //#endregion
  //#region Object
  it("Object: mutates", () => {
    set(obj, "01", {name: "Jon"})
    expect(obj["01"]).toEqual({name: "Jon"})
  })

  it("Object: normal notation", () => {
    expect(set(obj, "01", {name: "Jon"})["01"]).toEqual({name: "Jon"})
  })

  it("Object: dot-normal notation", () => {
    expect(set(obj, "evens.1", 3).evens[1]).toEqual(3)
  })
  //#endregion
})

describe("del", () => {
  let obj = {evens: [0, 2, 4], odds: [1, 3, 5]}
  let map = new Map([ ["01", {name: "Bobby"}], ["02", {name: "Jon"}] ])
  let aset = new Set([{name: "Bobby"}, {name: "Jon"}])

  beforeEach(() => {
    map = new Map([ ["01", {name: "Bobby"}], ["02", {name: "Jon"}] ])
    obj = {evens: [0, 2, 4], odds: [1, 3, 5]}
    aset = new Set([{name: "Bobby"}, {name: "Jon"}])
  })
  //#region Map
  it("Map: mutates", () => {
    del(map, "01")
    expect(map.get("01")).toBeUndefined()
  })

  it("Map: normal notation", () => {
    expect(del(map, "01").get("01")).toBeUndefined()
  })

  it("Map: dot-normal notation", () => {
    expect(del(map, "01.name").get("01")).toEqual({})
  })
  //#endregion
  //#region Set 
  it("Set: mutates & normal notation", () => {
    del(aset, {name: "Jon"})
    expect(aset.entries().next().value).toEqual(new Set([{name: "Bobby"}]).entries().next().value)
  })
  //#endregion
  //#region Object
  it("Object: mutates & normal notation", () => {
    del(obj, "evens").evens
    expect(obj.evens).toBeUndefined()
  })

  it("Object: dot-normal notation", () => {
    expect(del(obj, "evens.1").evens).toEqual([0, undefined, 4])
  })
})

describe("getVal", () => {
  const obj = {
    people: new Map([
      ["01", {
        name: "Jon",
        pets: new Set([{
          name: "Billy",
          breed: "Greyhund"
        }])
      }],
      ["02", {
        name: "Billy",
        pets: new Set([{
          name: "Billy",
          breed: "Greyhund"
        }])
      }],
      ["03", {
        name: "Ann",
        pets: new Set([{
          name: "Billy",
          breed: "Husky"
        }])
      }],
    ]),
    n: 2
  }

  it("Normal notation", () => {
    expect(getVal(obj, "n")).toBe(2)
  })

  it("Dot notation", () => {
    expect(getVal(obj, "people.01.name")).toBe("Jon")
  })
})
//#endregion