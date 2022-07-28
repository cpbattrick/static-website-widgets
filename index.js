const express = require("express");
const fs = require("fs");
const Handlebars = require("handlebars");
const marked = require("marked");
const env = process.env.NODE_ENV
const directory = env === "test" ? "./__mocks__" : "./public/content"
const path = require('path');

const app = express();
const port = process.env.port || 5005;

const options = {
  dotfiles: "ignore",
  etag: true,
  extensions: ["htm", "html"],
  index: false,
  maxAge: "7d",
  redirect: false,
  setHeaders: (res) => {
    res.set("x-timestamp", Date.now());
  }
};

app.use(express.static(path.join(__dirname, 'public'), options));

app.get("*", (req, res) => {
  const templateHtml = fs.readFileSync("./template.html", "utf8");
  const { path } = req;
  let content

  try {
    content = fs.readFileSync(`${directory}${path}/index.md`, "utf8");
  } catch (error) {
    res.status(404).send("404 Not Found");
    return
  }

  const html = marked.parse(content);

  const template = Handlebars.compile(templateHtml);

  const compiledHtml = template({
    content: html,
  });

  res.send(compiledHtml);
});


if (process.env.NODE_ENV !== 'test') {
  app.listen(port, (err) => {
    if (err) {
      return console.log("ERROR", err);
    }
    console.log(`Listening on port ${port}`);
  }
  )
}

module.exports = app;