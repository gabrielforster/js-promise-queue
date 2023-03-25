const http = require("http")
const path = require("path")
const { spawn } = require("child_process")

const MAX_PROCESS_PER_TIME = 2
let runningProcess = []

async function runBigProcessInQueue(){
  if(runningProcess.length >= MAX_PROCESS_PER_TIME){
    console.log("Queue is full! Waiting processes")
    await runningProcess[0]
    return runBigProcessInQueue()
  }

  console.log("Running process...")
  const promise = runBigProcess()
  runningProcess.push(promise)

  try{
    const result = await promise
    return result
  }catch(error){
    throw error
  }finally{
    runningProcess = runningProcess.filter((p) => p !== promise)
  }
}

async function runBigProcess(){
  return new Promise((resolve, reject) => {
    const proc = spawn("node", [
      path.resolve(__dirname, "run-big-process.js")
    ])

    const stderr = []

    proc.on("error", reject)

    proc.stdout.on("data", (data) => { })
    proc.stderr.on("data", (data) => { stderr.push(data) })

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
    await runBigProcessInQueue();
    console.log(`The process took ${new Date() - start}ms`)
    return res.end("BOMBED")
  }

  res.end("OK")
}).listen(5000)
