var express = require('express');
var path = require("path");
var app = express();
var port = process.env.PORT || 3000;

if (process.env.npm_lifecycle_event === "dev") {
  var webpackMiddleware = require("webpack-dev-middleware");
  var webpackConfig = require("./webpack.config");
  var webpack = require("webpack");

  app.use(webpackMiddleware(webpack(webpackConfig), {
    publicPath: "/build/"
  }));
}

app.use("/build", express.static("build"));
app.use(express.static("css"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
