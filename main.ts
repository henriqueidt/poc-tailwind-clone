const myFunction = require("./src/utils/parser.ts");
const fs = require("fs");
import express from "express";

const htmlUrl = "index.html";

const html = fs.readFileSync("index.html", "utf8");

const selectors = myFunction(html);

console.log("slectors", selectors);

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  fs.watchFile(htmlUrl, (abc) => {
    console.log(`${htmlUrl} file Changed`);
  });
});
