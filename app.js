const express = require("express");
const app = express();
var request = require("request");
const xml2js = require("xml2js");
const fs = require("fs");
const parser = new xml2js.Parser({ attrkey: "ATTR" });
var parseString = require("xml2js").parseString;
const cheerio = require("cheerio");

const port = process.env.PORT || 3000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/get/:slug", (req, res) => {
  request.get(
    "https://vietnamnet.vn/rss/" + req.param("slug") + ".rss",
    function (err, resp, body) {
      if (resp.statusCode === 200) {
        parseString(resp["body"], function (err, result) {
          var s = JSON.parse(JSON.stringify(result));
          var data = s.rss.channel;
          res.send(data[0]);
        });
      }
    }
  );
});

app.get("/api/search/:keyword", (req, res) => {
  var keyword = req.param("keyword");
  var responseHtml = "";

  request(
    `https://vietnamnet.vn/tim-kiem?${keyword}`,
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $(".main-result").each((index, el) => {
          const element = $(el).html();
          responseHtml += element;
        });
        res.send(responseHtml);
      } else {
        res.send(error);
      }
    }
  );
});

app.get("/article/:link", (req, res) => {
  var link = req.param("link");
  var responseHtml = "";

  request(`https://vietnamnet.vn/${link}`, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      $(".newsFeatureBox").each((index, el) => {
        const element = $(el).html();
        responseHtml += element;
      });
      res.set("Content-Type", "text/html");
      res.send(responseHtml);
    } else {
      res.send(error);
    }
  });
});
app.listen(port, () => {
  console.log("listening on " + port);
});
