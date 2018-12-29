import { update } from "../src/update"

describe("Keeps types", () => {
	it("Keeps Map", () => {
		const m = new Map([
			["01", { name: "John" }],
			["02", { name: "Ann" }],
			["03", { name: "Billy" }],
		])
		debugger
		expect(
			update(m, {
				$set: { "01.name": "Jimmy" },
			}) instanceof Map
		).toBeTruthy()
	})
})

describe("$addToSet", () => {
	it("Adds 1 to an array", () => {
		const o = {
			arr: [0],
		}
		expect(update(o, { $addToSet: { arr: 1 } }).arr).toEqual([0, 1])
	})

	it("Adds an array to an array", () => {
		const o = {
			arr: [0],
		}
		expect(update(o, { $addToSet: { arr: [1, 2] } }).arr).toEqual([0, [1, 2]])
	})

	it("Adds to multiple arrays", () => {
		const o = {
			arr1: [],
			arr2: [],
		}
		expect(update(o, { $addToSet: { arr1: 1, arr2: 2 } })).toEqual({
			arr1: [1],
			arr2: [2],
		})
	})

	it("Doesn't add duplicates", () => {
		const o = { a: [1], b: ["Hi"] }
		expect(update(o, { $addToSet: { a: 1, b: "Hi" } })).toEqual({
			a: [1],
			b: ["Hi"],
		})
	})

	it("Doesn't change on number", () => {
		const fo = {
			notArray: 1,
		}
		expect(update(fo, { $addToSet: { notArray: 2 } }).notArray).toBe(1)
	})

	it("Doesn't change on object", () => {
		const fo = {
			notArray: { a: 1 },
		}
		expect(update(fo, { $addToSet: { notArray: 2 } }).notArray).toEqual({
			a: 1,
		})
	})

	it("Doesn't mutate the target", () => {
		const o = { a: [] }
		update(o, { $addToSet: { a: 1 } })
		expect(o.a).toEqual([])
	})
})

describe("$set", () => {
	it("Sets 0 to 1", () => {
		const o = {
			a: 0,
		}
		expect(update(o, { $set: { a: 1 } }).a).toBe(1)
	})

	it("Sets multiple values", () => {
		const o = {
			a: 1,
			b: [1, 2, 3],
		}
		expect(update(o, { $set: { a: 2, b: [4, 5, 6] } })).toEqual({
			a: 2,
			b: [4, 5, 6],
		})
	})

	it("Doesn't set when types don't match", () => {
		const o = {
			a: 1, // number
		}
		expect(update(o, { $set: { a: "I'm a string!" } }).a).toBe(1)
	})

	it("Doesn't mutate the target", () => {
		const o = { a: 0 }
		update(o, { $set: { a: 1 } })
		expect(o.a).toBe(0)
	})
})

describe("$inc", () => {
	it("Increments target's prop", () => {
		const o = { a: 1 }
		expect(update(o, { $inc: { a: 2 } }).a).toBe(3)
	})

	it("Accepts negative numbers", () => {
		const o = { a: 2 }
		expect(update(o, { $inc: { a: -2 } }).a).toBe(0)
	})

	it("Doesn't change when called with NaN", () => {
		const o = { a: 2 }
		expect(update(o, { $inc: { a: "String here" } }).a).toBe(2)
		expect(update(o, { $inc: { a: {} } }).a).toBe(2)
		expect(update(o, { $inc: { a: NaN } }).a).toBe(2)
		expect(update(o, { $inc: { a: "String" } }).a).toBe(2)
		expect(update(o, { $inc: { a: [] } }).a).toBe(2)
	})

	it("Doesn't mutate the target", () => {
		const o = { a: 0 }
		update(o, { $inc: { a: 1 } })
		expect(o.a).toBe(0)
	})
})

describe("$min", () => {
	it("Changes when called with smaller value", () => {
		const o = { a: 20 }
		expect(update(o, { $min: { a: 10 } }).a).toBe(10)
	})

	it("Doesn't change when called with bigger value", () => {
		const o = { a: 20 }
		expect(update(o, { $min: { a: 30 } }).a).toBe(20)
	})

	it("Doesn't mutate the target", () => {
		const o = { a: 43 }
		update(o, { $min: { a: 1 } })
		expect(o.a).toBe(43)
	})
})

describe("$max", () => {
	it("Changes when called with bigger value", () => {
		const o = { a: 20 }
		expect(update(o, { $max: { a: 30 } }).a).toBe(30)
	})

	it("Doesn't change when called with smaller value", () => {
		const o = { a: 20 }
		expect(update(o, { $max: { a: 10 } }).a).toBe(20)
	})

	it("Doesn't mutate the target", () => {
		const o = { a: 43 }
		update(o, { $max: { a: 50 } })
		expect(o.a).toBe(43)
	})
})

/**
 * @TODO add the test
 */
describe("$mul", () => {
	it("Multiplies target's prop", () => {
		const o = { a: 1 }
		expect(update(o, { $mul: { a: 2 } }).a).toBe(2)
	})

	it("Accepts negative numbers", () => {
		const o = { a: 2 }
		expect(update(o, { $mul: { a: -2 } }).a).toBe(-4)
	})

	it("Doesn't change when called with NaN", () => {
		const o = { a: 2 }
		expect(update(o, { $mul: { a: "String here" } }).a).toBe(2)
		expect(update(o, { $mul: { a: {} } }).a).toBe(2)
		expect(update(o, { $mul: { a: NaN } }).a).toBe(2)
		expect(update(o, { $mul: { a: "String" } }).a).toBe(2)
		expect(update(o, { $mul: { a: [] } }).a).toBe(2)
	})

	it("Doesn't mutate the target", () => {
		const o = { a: 0 }
		update(o, { $inc: { a: 1 } })
		expect(o.a).toBe(0)
	})
})

describe("$rename", () => {
	it("Changes the key", () => {
		const o = { oldKey: 2 }
		expect(update(o, { $rename: { oldKey: "newKey" } })).toEqual({ newKey: 2 })
	})

	it("Doesn't accept invalid keys", () => {
		const o = { a: 1 }
		expect(update(o, { $rename: { a: () => {} } })).toEqual({ a: 1 })
		expect(update(o, { $rename: { a: undefined } })).toEqual({ a: 1 })
		expect(update(o, { $rename: { a: null } })).toEqual({ a: 1 })
		expect(update(o, { $rename: { a: [] } })).toEqual({ a: 1 })
	})

	it("Doesn't mutate the target", () => {
		const o = { a: 0 }
		update(o, { $rename: { a: "b" } })
		expect(o.a).toBe(0)
		// @ts-ignore
		expect(o.b).toBeUndefined()
	})
})

describe("$unset", () => {
	it("Deletes defined prop", () => {
		const o = { a: 1 }
		expect(update(o, { $unset: { a: 0 } })).toEqual({})
	})

	it("Doesn't fail when prop is undefined", () => {
		const o = {}
		expect(update(o, { $unset: { a: 0 } })).toEqual({})
	})

	it("Doesn't mutate the target", () => {
		const o = { a: 0 }
		update(o, { $unset: { a: "" } })
		expect(o.a).toBe(0)
	})
})

describe("$pull", () => {
	const o = {
		a: [1, 2, 3],
		b: ["a", "b"],
		c: [1, 5, 15],
		d: ["James the dog", "Carl the dog", "Joe the cat"],
	}
	const c = Object.assign({}, o)
	const a = [1, 2, 3, 4]

	it("Pulls out single item", () => {
		expect(update(o, { $pull: { a: 2 } }).a).toEqual([1, 3])
		expect(update(o, { $pull: { b: "a" } }).b).toEqual(["b"])
	})

	it("Works with $in", () => {
		expect(update(o, { $pull: { a: { $in: [2, 3] } } }).a).toEqual([1])
		expect(
			update(o, {
				$pull: {
					d: {
						$in: [/dog/],
					},
				},
			}).d
		).toEqual(["Joe the cat"])
	})

	it("Works with $nin", () => {
		expect(update(o, { $pull: { a: { $nin: [1, 2] } } }).a).toEqual([1, 2])
	})

	it("Works with $eq", () => {
		expect(update(o, { $pull: { a: { $eq: 2 } } }).a).toEqual([1, 3])
	})

	it("Works with $ne", () => {
		expect(update(o, { $pull: { a: { $ne: 2 } } }).a).toEqual([2])
	})

	it("Works with $gt", () => {
		expect(update(o, { $pull: { a: { $gt: 1 } } }).a).toEqual([1])
	})

	it("Works with $gte", () => {
		expect(update(o, { $pull: { a: { $gte: 1 } } }).a).toEqual([])
	})

	it("Works with $lt", () => {
		expect(update(o, { $pull: { a: { $lt: 2 } } }).a).toEqual([2, 3])
	})

	it("Works with $lte", () => {
		expect(update(o, { $pull: { a: { $lte: 2 } } }).a).toEqual([3])
	})

	it("Works with $and", () => {
		expect(
			update(o, {
				$pull: {
					c: {
						$and: [{ $in: [1, 2, 3, 4, 5] }, { $eq: 5 }],
					},
				},
			}).c
		).toEqual([1, 15])
	})

	it("Works with $or", () => {
		expect(
			update(o, {
				$pull: { c: { $or: [{ $in: [1, 2, 3, 4, 5] }, { $eq: 5 }] } },
			}).c
		).toEqual([15])
	})

	it("Works with $not", () => {
		expect(
			update(o, {
				$pull: { a: { $not: { $in: [1, 2] } } },
			}).a
		).toEqual([1, 2])

		expect(
			update(o, {
				$pull: {
					a: {
						$not: {
							$and: [{ $lt: 3 }, { $gt: 1 }],
						},
					},
				},
			}).a
		).toEqual([2])

		expect(
			update(o, {
				$pull: {
					a: {
						$not: 2,
					},
				},
			}).a
		).toEqual([2])
	})

	it("Works with $type", () => {
		expect(
			update(o, {
				$pull: {
					a: {
						$type: "number",
					},
				},
			}).a
		).toEqual([])

		expect(
			update(o, {
				$pull: { a: { $and: [{ $type: "number" }, { $gte: 2 }] } },
			}).a
		).toEqual([1])
	})

	it("Doesn't mutate the target", () => {
		update(o, { $pull: { a: { $lte: 2 } } })
		expect(o).toEqual(c)
	})
})

describe("$pop", () => {
	it("Pops element", () => {
		const o = { a: [1, 2, 3, 4] }
		expect(update(o, { $pop: { a: 1 } }).a).toEqual([1, 2, 3])
		expect(update(o, { $pop: { a: -1 } }).a).toEqual([2, 3, 4])
	})

	it("Doesn't change the array when called with a invalid value", () => {
		const o = { a: [1, 2, 3, 4] }
		expect(update(o, { $pop: { a: 54 } }).a).toEqual([1, 2, 3, 4])
		expect(update(o, { $pop: { a: -54 } }).a).toEqual([1, 2, 3, 4])
	})

	it("Doesn't mutate the target", () => {
		const o = { a: [1, 2, 3, 4] }
		update(o, { $pop: { a: 1 } })
		expect(o.a).toEqual([1, 2, 3, 4])
	})
})

describe("$push", () => {
	it("Pushes an item", () => {
		const o = { a: [1, 2] }
		expect(update(o, { $push: { a: 3 } }).a).toEqual([1, 2, 3])
	})

	it("Works with $each", () => {
		const o = { a: [1] }
		expect(update(o, { $push: { a: { $each: [2, 3] } } }).a).toEqual([1, 2, 3])
	})

	it("Doesn't mutate the target", () => {
		const o = { a: [1, 2, 3, 4] }
		update(o, { $push: { a: 1 } })
		expect(o.a).toEqual([1, 2, 3, 4])
	})
})

describe("$each", () => {
	const o = {
		array: [
			{
				name: "Jon Snow",
				age: 21,
			},
			{
				name: "Ann Snow",
				age: 19,
			},
			{
				name: "Lill Snow",
				age: 7,
			},
		],
	}

	it("Doesn't mutate the target", () => {
		update(o, {
			$each: {
				array: {
					$pull: {
						$gte: 18,
					},
				},
			},
		})
		expect(o.array).toEqual([
			{
				name: "Jon Snow",
				age: 21,
			},
			{
				name: "Ann Snow",
				age: 19,
			},
			{
				name: "Lill Snow",
				age: 7,
			},
		])
	})

	it("Works with $set", () => {
		expect(
			update(o, {
				$each: {
					array: {
						$set: {
							age: 18,
						},
					},
				},
			}).array
		).toEqual([
			{
				name: "Jon Snow",
				age: 18,
			},
			{
				name: "Ann Snow",
				age: 18,
			},
			{
				name: "Lill Snow",
				age: 18,
			},
		])
	})
})
