const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { UserModel } = require("./models/models");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const { username } = req.body;

  UserModel.find({ username: username })
    .then((doc) => {
      if (doc.length > 0) {
        const { username, _id } = doc[0];
        res.json({
          username: username,
          _id: _id,
        });
      } else {
        const newUser = new UserModel({ username: username });
        newUser
          .save()
          .then((doc) => {
            const { username, _id } = doc;
            res.json({
              username: username,
              _id: _id,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;
  let error;
  if (!description) {
    res.status(500).json({ error: "Description is required" });
    error = "NoDescriptionError";
  }
  if (!duration) {
    res.status(500).json({ error: "Duration is required" });
    error = "NoDurationError";
  }
  if (!date) {
    res.status(500).json({ error: "Date is required" });
    error = "NoDateError";
  }
  if (!error) {
    res.json({
      id: userId,
      description: description,
      duration: duration,
      date: date,
    });
  } else {
    console.log(error);
  }
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
