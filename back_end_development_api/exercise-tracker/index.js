const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { UserModel, ExerciseModel } = require("./models/models");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", (req, res) => {
  UserModel.find({}, { _id: 1, username: 1 }).then((result) => {
    res.json(result);
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  // res.send(req.query);
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (from && isNaN(fromDate)) {
    res.json({ error: "Could not parse from-date." });
  }

  if (to && isNaN(toDate)) {
    res.json({ error: "Could not parse to-date." });
  }

  let filter = {
    userId: _id,
  };

  if (!isNaN(fromDate)) {
    if (!isNaN(toDate)) {
      filter["date"] = { $gte: fromDate, $lte: toDate };
    } else {
      filter["date"] = { $gte: fromDate };
    }
  } else {
    if (!isNaN(toDate)) {
      filter["date"] = { $lte: toDate };
    }
  }
  UserModel.findOne({ _id: _id })
    .then((user) => {
      ExerciseModel.find(filter)
        .limit(limit ? limit : 0)
        .then((doc) => {
          res.json({
            _id: _id,
            username: user.username,
            count: doc.length,
            log: doc,
          });
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
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
  UserModel.findOne({ _id: userId })
    .then((user) => {
      if (user) {
        const newExercise = new ExerciseModel({
          userId: userId,
          description: description,
          duration: duration,
          date: date,
        });

        newExercise
          .save()
          .then((result) => {
            const fDate = new Date(result.date);
            let formattedDoc = { ...result._doc };
            formattedDoc.date = fDate.toDateString();
            res.json(formattedDoc);
          })
          .catch((err) => {
            res.send(err);
          });
      } else {
        res.json({ error: "User not found" });
      }
    })
    .catch((err) => {
      res.send(err);
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
