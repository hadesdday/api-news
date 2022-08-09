const express = require("express");
const app = express();
var request = require("request");
const xml2js = require("xml2js");
const fs = require("fs");
const parser = new xml2js.Parser({ attrkey: "ATTR" });
var parseString = require("xml2js").parseString;

const port = 3000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/blog", (req, res) => {
  request.get(
    "https://vietnamnet.vn/rss/chinh-tri.rss",
    function (err, resp, body) {
      if (resp.statusCode === 200) {
        const re = resp["body"];
        const rep = parseString(re, function (err, result) {
          res.send({ result });
        });
      }
    }
  );
});

app.get("/api/get/:slug", (req, res) => {
  request.get(
    "https://vietnamnet.vn/rss/" + req.param("slug") + ".rss",
    function (err, resp, body) {
      if (resp.statusCode === 200) {
        parseString(resp["body"], function (err, result) {
          var s = JSON.parse(JSON.stringify(result));
          var data = s.rss.channel;
          res.send({ data });
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log("listening on " + port);
});
