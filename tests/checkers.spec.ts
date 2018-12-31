import { compare } from "../src/checkers";

describe("compare", () => {
  it("Matches primitives", () => {
    const str1 = "Hello"
    const str2 = "there"

    expect(compare(1, 1)).toBeTruthy()
    expect(compare(2, 2)).toBeTruthy()
    expect(compare(1, 2)).toBeFalsy()
    expect(compare(2, 1)).toBeFalsy()

    expect(compare(str1, str1)).toBeTruthy()
    expect(compare(str2, str2)).toBeTruthy()
    expect(compare(str1, str2)).toBeFalsy()
    expect(compare(str2, str1)).toBeFalsy()

    expect(compare(true, true)).toBeTruthy()
    expect(compare(false, false)).toBeTruthy()
    expect(compare(true, false)).toBeFalsy()
    expect(compare(false, true)).toBeFalsy()
  })

  it("Matches higher types", () => {
    const obj1 = {name: "Jon Snow"}
    const obj2 = {name: "Poppy"} 
    const arr1 = [1, 2, 3], arr1p = [3, 2, 1]
    const arr2 = [4, 5, 6], arr2p = [6, 5, 4]
    const map1 = new Map([["01", {name: "Steve"}]]) 
    const map2 = new Map([["01", {name: "Bobby"}]]) 
    const set1 = new Set(arr1), set1p = new Set(arr1p)
    const set2 = new Set(arr2)

    expect(compare(obj1, obj1)).toBeTruthy()
    expect(compare(obj2, obj2)).toBeTruthy()
    expect(compare(obj1, obj2)).toBeFalsy()
    expect(compare(obj2, obj1)).toBeFalsy()
    
    
    expect(compare(map1, map1)).toBeTruthy()
    expect(compare(map2, map2)).toBeTruthy()
    expect(compare(map1, map2)).toBeFalsy()
    expect(compare(map2, map1)).toBeFalsy()
    
    expect(compare(set1, set1)).toBeTruthy()
    expect(compare(set1, set1p)).toBeTruthy()
    expect(compare(set1, set2)).toBeFalsy()

    expect(compare(arr1, arr1)).toBeTruthy()
    expect(compare(arr2p, arr2)).toBeTruthy()
    expect(compare(arr2, arr1)).toBeFalsy()
  })
})