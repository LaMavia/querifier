# Querifier
Mongo-like query execution on javascript objects

## Currently available 
1. [Update](#update)
2. [Get](#get)
3. [Operators](#operators)
4. [Conditionals](#conditionals)

# Features
## <div id="update">Update</div>
Performes a not mutating action on an object 
>Example
```typescript
  const object = {
    n: 2
  }

  update(object, {n: 4})
  // -> { n: 4 }
  
```
Bisides accepting a classical ```key: value``` pairs, it accepts special operators, just like MongoDB queries.
## <div id="get">Get</div>
Performes a search operation on specified collections of an object. Accepts an object, `ConditionQuery` and `options`
>Example
```typescript
  const object = {
    evens: [0, 2, 4, 6, 8],
    odds: [1, 3, 5, 7, 9]
  }

  get(object, {
    evens: {
      $lt: 6
    },
    odds: {
      $lt: 7
    }
  }, {
    $sort: "asc"
  })
  // -> [1, 2, 3, 4, 5]
```  
### <div id="operators">Operators:</div>
#### $set
>Sets a new value of object's property **only** if their types match
```typescript
const object = { number: 2 }
update(object, { $set: { number: "newValue" } }) ❌
// -> { number: 2 }

update(object, { $set: { number: 21 } }) ✔️
// -> { number: 21 }
```


#### $inc
>Increments object's value by some number. It accepts both positive and negative numbers
```typescript
const object = { number: 2 }

update(object, { $inc: { number: "2" } }) ❌
// -> { number: 2 }

update(object, { $inc: { number: -2 } }) ✔️
// -> { number: 0 }
```


#### $min 
> Changes the value when it's smaller than the current one
```typescript
const object = { number: 20 }
update(object, { $min: { number: 30 } }) ❌
// -> { number: 20 }

update(object, { $min: { number: 10 } }) ✔️
// -> { number: 10 }
```


#### $max
> Changes the value when it's bigger than the current one
```typescript
const object = { number: 20 }
update(object, { $max: { number: 10 } }) ❌
// -> { number: 20 }

update(object, { $max: { number: 30 } }) ✔️
// -> { number: 30 }
```

#### $mul
> Multiplies object's value. If it's undefined, ```update``` assigns 0 to the key
 ```typescript
 const object = { number: 2 }

 update(object, { $mul: { number: 4 } })
 // -> { number: 8 }

 update(object, { $mul: { x: 2 } })
 // -> {number: 2, x: 0}
 ```

#### $rename
> Renames object's key. Accepts: ```symbol, string, number```
 ```typescript
 const object = { oldKey: 2 }
 
 update(object, { $rename: { oldKey: () => {} } }) ❌
 // -> { oldKey: 2 }
 
 update(object, { $rename: { oldKey: "newKey" } }) ✔️
 // -> { newKey: 2 }
 ```

#### $unset
> Deletes object's property
 ```typescript
 const object = { dontNeedThat: 2 }

 update(object, { $unset: { dontNeedThat: "Anything you want" } })
 // -> {}
 ```

#### $addToSet
> Adds an item literal to the array. If you want to concatinate an array, checkout the [$push](#push) operator
 ```typescript
 const object = { array: [1, 2, 3, 4] }

 update(object, { $addToSet: { array: 5 } })
 // -> { array: [1, 2, 3, 4, 5] }

 update(object, { $addToSet: { array: [5, 6] } })
 // -> { array: [1, 2, 3, 4, [5, 6]] }
 ```

#### $pull
> Pulls out matching elements from an array. Accepts elements and [conditional operators](#conditionals)
```typescript
  const object = { array: [1, 2, 3, 4, 5] }

  update(object, { $pull: { array: 3 } })
  // -> { array: [1, 2, 4, 5] }

  update(object, { $pull: { array: { $in: [1, 2, 3] } } })
  // -> { array: [4, 5] }
```

### $pop
> Removes the first element of an array when called with `-1` and the last element when called with `1`. Doesn't remove anything when called with something else
```typescript
  const object = { array: [1, 2, 3] }

  update(object, { $pop: { array: 543 } }) ❌
  update(object, { $pop: { array: "String" } }) ❌

  update(object, { $pop: { array: 1 } }) ✔️
  // -> { array: [1, 2] }
```

### $push
> Pushes items to the array. Besides elements, also accepts `$each` operator, which unwraps the input
```typescript
  const object = { array: [1, 2, 3] }

  update(object, { $push: { array: 4 } })
  // -> { array: [1, 2, 3, 4] }

  update(object, { $push: { array: [4, 5] } }) ❌
  // -> { array: [1, 2, 3, [4, 5]] }

  update(object, { $push: { array: { $each: [4, 5] } } }) ✔️
  // -> { array: [1, 2, 3, 4, 5] }
```

## <div id="conditionals">Conditional operators</div>
Example
```typescript
  const object = {array: [1, 2, 3, 4]}

  update(object, { $pull: { array: { $eq: 4 } } }) 
  // -> { array: [1, 2, 3] }

  update(object, { $pull: { array: { $in: [1, 2] } } }) 
  // -> { array: [3, 4] }

  get(object, { array: { $gte: 3 } })
  // -> [3, 4]
```
### $eq
> Matches values that are equal to a specified value
### $ne
> Matches values that aren't equal to a specified value
### $gt
> Matches values that are greater than a specified value
### $gte
> Matches values that are greater than or equal to a specified value
### $lt
> Matches values that are less than a specified value
### $lte
> Matches values that are less than or equal to a specified value
### $in
> Matches values that are members of a specified value
### $nin
> Matches values that aren't members of a specified value
### $and
> Joins query elements with the logical `and` operator. Accepts and array of conditionals
```typescript
const object = { array: [1, 2, 3, 4] }

update(object, {$pull:{array: { $and: [
  { $gt: 2 },
  { $lt: 5 },
  { $in: [3, 4, 5] }
] }}})
// -> { array: [1, 2, 5] }
```
### $or
> Joins query elements with the logical `or` operator. Accepts and array of conditionals
```typescript
const object = { array: [1, 2, 3, 4] }

update(object, {$pull:{array: { $or: [
  { $eq: 2 },
  { $eq: 4 }
] }}})
// -> { array: [1, 3] }
```
### $not 
> Performs the logical `not` operation with the value
```typescript
const object = { array: [1, 2, 3] }

update(object, {
  $pull: {
    array: {
      $not: {
        $eq: 3
      }
    }
  }
}) // -> { array: [3] }

update(object, {
  $pull: {
    array: {
      $not: 2
    }
  }
}) // -> { array: [2] }
``` 

### $type
> Returns true if type matches
```typescript
const object = {array: [1, 2, "Dog"]}

update(object, {
  $pull: {
    array: {
      $type: "string"
    }
  }
}) // -> { array: [1, 2] }
``` 
### $match
> Returns a result of `Regexp.test`
```typescript
const object = {
  files: [
    "index.ts",
    "get.ts",
    "update.ts",
    "lame.js"
  ],
  people: [
    "Jon Snow",
    "Ann Snow",
    "Lil Snow",
    "Lil Notsnow",
  ]
}

update(object, {
  $pull: {
    files: {
      $match: /\.js$/
    }
  }
}) // -> { people: [...], files: ["index.ts", "get.ts", "update.ts"] }

get(object, {
  people: {
    $match: /\w*\sSnow/
  }
}) // -> ["Jon Snow", "Ann Snow", "Lil Snow"]
``` 
### $exec
> Returns a result of the given function of type: ``` <T>(item: T) => boolean```
```typescript
const object = {
  people: [
    {
      name: "Jon Snow",
      age: 21
    },
    {
      name: "Ann Snow",
      age: 20
    },
    {
      name: "Lil Snow",
      age: 8
    }
  ]
}

get(object, {
  people: {
    $exec(person) {
      return person.age >= 18
    }
  }
}) // -> [{name: "Jon Snow", age: 21}, {name: "Ann Snow", age: 20}]
``` 