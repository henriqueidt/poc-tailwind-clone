const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config.js");
const myFunction = require("./src/utils/parser.ts");
const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");

const selectors = myFunction(html);

console.log("slectors", selectors);

// Create a Webpack compiler instance with the provided configuration
const compiler = webpack(webpackConfig);

const devServerOptions = { ...webpackConfig.devServer, open: false };

// Create a new WebpackDevServer instance
const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log("Starting server...");
  await server.start();
};

runServer();

// Run the compilation process
// compiler.run((err, stats) => {
//   console.log("HABDHASBDHABDHASDBAHDBAHSDBSAH");

//   if (err) {
//     console.error(err);
//     return;
//   }

//   // Process the build statistics and output relevant information
//   console.log(
//     stats.toString({
//       colors: true,
//       modules: false,
//       chunks: false,
//       chunkModules: false,
//     })
//   );

//   console.log("asd");
// });
