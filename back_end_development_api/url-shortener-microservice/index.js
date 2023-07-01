require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const app = express();
const mongoose = require("mongoose");
const { UrlModel } = require("./models/urlModel");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:shortUrlNum", (req, res) => {
  UrlModel.findOne({
    short_url: req.params.shortUrlNum,
  }).then((result) => {
    if (result) {
      res.redirect(301, result.original_url);
    } else {
      res.sendStatus(404);
    }
  });
});

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  let strippedUrl = url.replace(/^https?:\/\//i, "");

  dns.lookup(strippedUrl, (err) => {
    if (err) {
      res.status(400).json({ error: "Invalid URL" });
    } else {
      const urlRecord = UrlModel.findOne({
        original_url: url,
      })
        .then((doc) => {
          if (doc) {
            res.json({
              original_url: url,
              short_url: doc.short_url,
            });
          } else {
            UrlModel.find()
              .sort({ short_url: -1 })
              .limit(1)
              .then((doc) => {
                const maxIndex = doc[0] ? doc[0].short_url + 1 : 0;
                const newUrl = new UrlModel({
                  original_url: url,
                  short_url: maxIndex,
                });
                newUrl.save().then((doc) => {
                  res.json({
                    original_url: doc.original_url,
                    short_url: doc.short_url,
                    details: "New URL inserted.",
                  });
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://spierce:acUwpTlEhrwb9HtZ@cluster0.4xckye0.mongodb.net/?retryWrites=true&w=majority"
    );
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

module.exports = app;
