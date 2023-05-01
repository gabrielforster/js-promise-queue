const http = require('http');
const fs = require('fs');

function saveLog(){
  void new Promise((resolve, reject) => {
    fs.appendFile('void-calls.txt', `\n${Date.now()}`, (error) => {
      if(error) return reject(error);
      resolve();
    })
  })
}

async function listLog(){
  return new Promise((resolve, reject) => {
    fs.readFile('void-calls.txt', 'utf8', (error, data) => {
      if(error) return reject(error);
      const dates = data.split('\n');

      resolve(dates.map(date => new Date(Number(date)).toLocaleDateString()).join('\n'));
    })
  })
}

const server = http.createServer(async(req, res) => {
  if(req.url === '/void'){
    saveLog();
    return res.end('voided');
  }

  if(req.url === '/logs'){
    return res.end(await listLog());
  }

  res.end('Passed')
})

server.listen(5000);
