# Querify
Mongo-like query execution on javascript objects

## Currently aniviable 
1. [Update](#update)

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
### Operators:
#### $set
>Sets a new value of object's property **only** if their types match
>```typescript
>const object = { number: 2 }
>update(object, { $set: { number: "newValue" } }) ❌
>// -> { number: 2 }
>
>update(object, { $set: { number: 21 } }) ✔️
>// -> { number: 21 }
>```


#### $inc
>Increments object's value by some number. It accepts both positive and negative numbers
>```typescript
>const object = { number: 2 }
>
>update(object, { $inc: { number: "2" } }) ❌
>// -> { number: 2 }
>
>update(object, { $inc: { number: -2 } }) ✔️
>// -> { number: 0 }
>```


#### $min 
> Changes the value when it's smaller than the current one
>```typescript
>const object = { number: 20 }
>update(object, { $min: { number: 30 } }) ❌
>// -> { number: 20 }
>
>update(object, { $min: { number: 10 } }) ✔️
>// -> { number: 10 }
>```


#### $max
> Changes the value when it's bigger than the current one
>```typescript
>const object = { number: 20 }
>update(object, { $max: { number: 10 } }) ❌
>// -> { number: 20 }
>
>update(object, { $max: { number: 30 } }) ✔️
>// -> { number: 30 }
>```

#### $mul
> Multiplies object's value. If it's undefined, ```update``` assigns 0 to the key
> ```typescript
> const object = { number: 2 }
>
> update(object, { $mul: { number: 4 } })
> // -> { number: 8 }
>
> update(object, { $mul: { x: 2 } })
> // -> {number: 2, x: 0}
> ```

#### $rename
> Renames object's key. Accepts: ```symbol, string, number```
> ```typescript
> const object = { oldKey: 2 }
> 
> update(object, { $rename: { oldKey: () => {} } }) ❌
> // -> { oldKey: 2 }
> 
> update(object, { $rename: { oldKey: "newKey" } }) ✔️
> // -> { newKey: 2 }
> ```

#### $unset
> Deletes object's property
> ```typescript
> const object = { dontNeedThat: 2 }
>
> update(object, { $unset: { dontNeedThat: "Anything you want" } })
> // -> {}
> ```

#### $addToSet
> Adds an item literal to the array. If you want to concatinate an array, checkout the [$push](#push) operator
> ```typescript
> const object = { array: [1, 2, 3, 4] }
>
> update(object, { $addToSet: { array: 5 } })
> // -> { array: [1, 2, 3, 4, 5] }
>
> update(object, { $addToSet: { array: [5, 6] } })
> // -> { array: [1, 2, 3, 4, [5, 6]] }
> ```