import tailwindclone from "tailwind-clone";
import express from "express";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

tailwindclone.init("index.html", "styles.css");

const app = express();

app.use(
  "/node_modules",
  express.static("node_modules", {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(8080, () => {
  console.log("Server is running on port 3000");
});
