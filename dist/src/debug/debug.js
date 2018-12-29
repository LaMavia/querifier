"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_1 = require("../update");
const m = new Map([
    ["01", { name: "John" }],
    ["02", { name: "Ann" }],
    ["03", { name: "Billy" }]
]);
debugger;
const x = update_1.update(m, {
    $set: {
        "01.name": "Jimmy"
    }
});
debugger;
