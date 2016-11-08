const path = require("path")

module.exports = {
  devTool: "source-map",
  entry: path.join(__dirname, "lib", "main.js"),
  output: {
    path: path.join(__dirname, "build"),
    publicPath: "/build/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.ms$/, loader: "hogan"}
    ]
  }
};
