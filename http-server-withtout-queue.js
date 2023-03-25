const http = require("http")

function runBigProcess(){
  for(let i = 0; i < 500000;i++){
    console.log(i)
  }
  return;
}

http.createServer((req, res) => {
  if(req.url === "/bomb"){
    const start = new Date();
    runBigProcess();
    console.log(`The process took ${new Date() - start}ms`)
    return res.end("BOMBED")
  }

  res.end("OK")
}).listen(5000)
