import { getVal, getPrelastValue } from "../helpers/changers"
import { update } from "../update";
const m = new Map([
  ["01", {name: "John"}],
  ["02", {name: "Ann"}],
  ["03", {name: "Billy"}]
])
debugger
const x = update(m, {
  $set: {
    "01.name": "Jimmy"
  }
})
debugger