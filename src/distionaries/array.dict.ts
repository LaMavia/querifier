import { throwError } from "..";

export interface Arrayable {
  [key: string]: ArrayQuery | string | symbol | number
}

export interface ArrayQuery {
  $each: any[]
}

export const arrayDictionary = {
  $each: <T>(target: T[]) => (items: T[] = throwError()) => target.concat(items)
  
}