import fs from "fs-extra"
import p from "path"
const state = {
	n: 0
}
function lines(path: string) {
	const fileRegex = /.*\..*$/

	function getNumOfLines(filePath: string): Promise<number> {
		return new Promise((res, rej) => {
			let out = 1
			// debugger
			fs.createReadStream(filePath)
				.on("data", (c: any[]) => {
					// debugger
					let i = 0
					out-- // Because the loop will run once for idx=-1
					do {
						i = c.indexOf(10, i + 1)
						out++
					} while (i !== -1)
				})
				.on("end", () => {
					// console.log(`[${filePath}]> ${out}`)
					state.n += out
					res(out)
				})
		})
	}

	if (fileRegex.test(path)) {
		getNumOfLines(path)
		return
	} else {
		fs
			.readdir(path)
			.then(x => {
				for (const fname of x) {
					if (fileRegex.test(fname)) {
						getNumOfLines(p.resolve(path, fname)).then(
							c => state.n += c
						)
					} else {
						lines(p.resolve(path, fname))
					}
        }        
			})
			.catch(err => {
				console.log(`
        [ERROR]> "${err}"\n
        [FILEPATH]> ${path}
      `)
				debugger
			})
	}
}
(async () => {
	await lines("C:/Users/xelox/Projects/node/2test/server/src")
})()
console.log(137+10+430+13+60+178+38)
