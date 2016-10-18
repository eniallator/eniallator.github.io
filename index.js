var express = require('express');
var path = require("path");
var app = express();
var port = process.env.$PORT || 3000;

app.use(express.static("build"));
app.use(express.static("css"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});