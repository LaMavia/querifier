"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const state = {
    n: 0
};
function lines(path) {
    const fileRegex = /.*\..*$/;
    function getNumOfLines(filePath) {
        return new Promise((res, rej) => {
            let out = 1;
            // debugger
            fs_extra_1.default.createReadStream(filePath)
                .on("data", (c) => {
                // debugger
                let i = 0;
                out--; // Because the loop will run once for idx=-1
                do {
                    i = c.indexOf(10, i + 1);
                    out++;
                } while (i !== -1);
            })
                .on("end", () => {
                // console.log(`[${filePath}]> ${out}`)
                state.n += out;
                res(out);
            });
        });
    }
    if (fileRegex.test(path)) {
        getNumOfLines(path);
        return;
    }
    else {
        fs_extra_1.default
            .readdir(path)
            .then(x => {
            for (const fname of x) {
                if (fileRegex.test(fname)) {
                    getNumOfLines(path_1.default.resolve(path, fname)).then(c => state.n += c);
                }
                else {
                    lines(path_1.default.resolve(path, fname));
                }
            }
        })
            .catch(err => {
            console.log(`
        [ERROR]> "${err}"\n
        [FILEPATH]> ${path}
      `);
            debugger;
        });
    }
}
(() => __awaiter(this, void 0, void 0, function* () {
    yield lines("C:/Users/xelox/Projects/node/querifier/src");
    yield lines("C:/Users/xelox/Projects/node/2test/server/src");
    setTimeout(() => {
        console.log(`Lines of code: ${state.n}`);
    }, 3000);
}))();
