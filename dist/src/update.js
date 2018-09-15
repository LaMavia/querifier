"use strict";
/*const execQuery = <T extends ObjectLit>(object: T, query: UpdateQuery): T => {
  const target = JSON.parse(JSON.stringify(object))
    for (const prop in query) {
    if (prop in dictionary) {
            const args = []
      args.push(query[prop])
      delete query[prop]
            // @ts-ignore
            dictionary[prop](target)(...args)
    } else {
      target[prop] = query[prop]
    }
  }
        

    return target
}*/ 
