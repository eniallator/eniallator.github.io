const http = require("http");
const fs = require('fs');

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  var fileName = "";

  if (req.url === "/"){
    fileName = "index.html"

  } else if (req.url != "/favicon.ico"){
    fileName = req.url.substring(1)
  }

  const readFileStream = fs.createReadStream(fileName);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");

  readFileStream.pipe(res);
});

server.listen(port, hostname, ()=>{
  console.log(`Server running at http://${hostname}:${port}/`)
});
