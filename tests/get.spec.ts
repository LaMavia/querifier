import { get } from "../src/get"
interface User {
	name: string
	age: number
}
interface Dog {
	name: string
	breed: string
}
interface Cat {
	name: string
	age: number
}

const a = {
	primes: [1, 2, 3, 5, 7, 11, 13, 17, 23],
	evens: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
	odds: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
	people: ["Jon Snow", "Ben Snow", "Jon Johny", "Ξον Σνος", "なに"],
	users: {
		"00001": {
			name: "John",
			age: 21,
		},
		"00002": {
			name: "Jack",
			age: 15,
		},
		"00003": {
			name: "Bob",
			age: 14,
		},
		"00004": {
			name: "Steve",
			age: 24,
		},
		"00005": {
			name: "Ann",
			age: 18,
		},
		"00006": {
			name: "Bobby",
			age: 37,
		},
	},
	dogs: new Map([
		[
			"0001",
			{
				name: "Django",
				breed: "York",
			},
		],
		[
			"0002",
			{
				name: "Barry",
				breed: "Spaniel",
			},
		],
		[
			"0003",
			{
				name: "Kinky",
				breed: "Greyhund",
			},
		],
		[
			"0004",
			{
				name: "Bobby",
				breed: "Dogge",
			},
		],
	]),
	cats: new Set([
		{
			name: "Jelly",
			age: 2,
		},
		{
			name: "Kinkyy",
			age: 4,
		},
		{
			name: "Pimpy",
			age: 1,
		}
	])
}
// Settings
describe("$sort", () => {
	it("asc", () => {
		expect(
			get(
				a,
				{
					primes: { $ne: 0 },
				},
				{
					$sort: "asc",
					$mapper(x: number) {
						return x	
					}
				}
			)
		).toEqual(a.primes)
	})

	it("dsc", () => {
		expect(
			get(
				a,
				{
					primes: { $ne: 0 },
				},
				{
					$sort: "dsc",
				}
			)
		).toEqual(a.primes.slice().reverse())
	})
})

describe("Injects wanted values", () => {
	it("Arrays", () => {
		expect(
			get(
				a,
				{
					primes: {
						$lte: 7,
					},
				},
				{
					$inject: {
						odds: true,
					},
					$sort: "asc",
				}
			)
		).toEqual([1, 1, 2, 3, 3, 5, 5, 7, 7, 9, 11, 13, 15, 17, 19])
	})
})

describe("$eq", () => {
	it("Works", () => {
		expect(get(a, { primes: { $lte: 7 } })).toEqual([1, 2, 3, 5, 7])
	})
})

describe("$match", () => {
	it("Matches strings", () => {
		expect(
			get(a, {
				people: {
					$match: /\w/g,
				},
			})
		).toEqual(["Jon Snow", "Ben Snow", "Jon Johny"])
	})

	it("Matches digits", () => {
		expect(
			get(a, {
				primes: {
					$match: /^\d{2}$/,
				},
			})
		).toEqual([11, 13, 17, 23])
	})
})

describe("$exec", () => {
	it("Matches objects", () => {
		expect(
			get(a, {
				users: {
					$exec: (u: User) => u.name === "Jack",
				},
			})
		).toEqual([
			{
				name: "Jack",
				age: 15,
			},
		])
	})

	it("Matches objects with $mapper", () => {
		expect(
			get(
				a,
				{
					users: {
						$exec: (u: User) => u.name === "Jack",
					},
				},
				{
					$mapper(v): User {
						return v
					},
				}
			)
		).toEqual([
			{
				name: "Jack",
				age: 15,
			},
		])
	})

	it("Matches maps", () => {
		expect(
			get(a, {
				dogs: {
					$exec([key, d]: [string, Dog]) {
						return d.breed === "York"
					},
				},
			})
		).toEqual([
			[
				"0001",
				{
					name: "Django",
					breed: "York",
				},
			],
		])
	})

	it("Matches Maps with $mapper", () => {
		expect(
			get(
				a,
				{
					dogs: {
						$exec: (d: Dog) => {
							return d.breed === "York"
						},
					},
				},
				{
					$mapper: ([_id, obj]: [string, Dog]): typeof obj & {_id: string} => {
						return {
							...obj,
							_id,
						}
					},
				}
			)
		).toEqual([
			{
				name: "Django",
				breed: "York",
				_id: "0001",
			},
		])
	})

	it("Matches Sets", () => {
		expect(get(a, {
			cats: {
				$exec(c: Cat) {
					return c.age === 2
				}
			}
		})).toEqual([
			{
				name: "Jelly",
				age: 2,
			}
		])
	})

	it("Matches Sets with $mapper", () => {
		expect(get(a, {
			cats: {
				$exec(c: Cat) {
					return c.name === "jelly"
				}
			}
		}, {
			$mapper(c: Cat): Cat {
				c.name = c.name.toLowerCase()
				return c
			}
		})).toEqual([
			{
				name: "jelly",
				age: 2,
			}
		])
	})
})
