# Querify
Mongo-like query execution on javascript objects

## Currently available 
1. [Update](#update)
2. [Operators](#operators)

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