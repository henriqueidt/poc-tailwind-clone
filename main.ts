import { getSelectorsFromHtml } from "./src/utils/htmlParser";
const fs = require("fs");
import * as path from "path";
import express from "express";
import { promisify } from "util";
import { parseCss } from "./src/utils/cssParser";
import WebSocket from "ws";
import { wss, broadcast } from "./src/utils/websocketSetup";
import { minifyCss } from "./src/utils/cssMinifier";
import * as http from "http";

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
  const minifiedCss = minifyCss(parsedCss);
  createCssFile(minifiedCss);
};

const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wsServer = new WebSocket.Server({ server });

// Start the WebSocket server
wsServer.on("connection", (ws) => {
  wss.emit("connection", ws);
});

const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  let wait: boolean | NodeJS.Timeout;
  fs.watch(htmlUrl, (_: any, filename: string) => {
    if (filename) {
      if (wait) return;
      wait = setTimeout(() => {
        wait = false;
      }, 250);
      const html = fs.readFileSync(filename, "utf8");
      console.log(`${filename} file Changed`);
      broadcast(
        JSON.stringify({
          type: "reload",
          htmlContent: html,
        })
      );
      readHtml(filename);
    }
  });
});
