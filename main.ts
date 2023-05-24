import { getSelectorsFromHtml } from "./src/utils/htmlParser";
const fs = require("fs");
import * as path from "path";
import express from "express";
import { promisify } from "util";
import { parseCss } from "./src/utils/cssParser";
import { Response } from "express-serve-static-core";

const htmlUrl = "index.html";
const cssUrl = "styles.css";

const asyncFs = {
  access: promisify(fs.access),
  readFile: promisify(fs.readFile),
};

const createCssFile = (rawCss: string) => {
  fs.writeFile("./public/parsedStyles.css", rawCss, (err: any) => {
    if (err) {
      console.log("error creating css file: ", err);
    } else {
      console.log("file created sucessfully");
    }
  });
};

const readHtml = async (filename: string) => {
  const html = fs.readFileSync(filename, "utf8");
  const selectors = getSelectorsFromHtml(html);
  const css = await asyncFs.readFile(cssUrl, "utf-8");
  const parsedCss = parseCss(css, selectors);
  createCssFile(parsedCss);
};

const app = express();

const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  let wait: boolean | NodeJS.Timeout;
  fs.watch(htmlUrl, (event: any, filename: string) => {
    if (filename) {
      if (wait) return;
      wait = setTimeout(() => {
        wait = false;
      }, 250);
      console.log(`${filename} file Changed`);
      readHtml(filename);
    }
  });
});
