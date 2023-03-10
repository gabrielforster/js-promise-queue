const http = require("http")
const path = require("path")
const { spawn } = require("child_process")

async function runProcess(){
	return new Promise((resolve, reject) => {
		const proc = spawn("node", [
			path.resolve(__dirname, "run-big-process.js")
		])

		const stderr = []

		proc.on("error", reject)

		proc.stdout.on("data", (data) => {
			console.log(data.toString())
		})

		proc.stderr.on("data", (data) => {
			stderr.push(data)
		})

		proc.on("close", () => {
			if(stderr.length){
				return reject(stderr.join(""))
			}

			resolve()
		})

	})
}

http.createServer(async(req, res) => {
	if(req.url === "/bomb"){
		const start = new Date();
		await runProcess();
		console.log(`The process took ${new Date() - start}ms`)
		return res.end("BOMBED")
	}

	res.end("OK")
}).listen(5000)
