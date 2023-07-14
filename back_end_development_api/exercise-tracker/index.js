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

  // let filter = {
  //   userId: _id,
  // };

  // if (!isNaN(fromDate)) {
  //   if (!isNaN(toDate)) {
  //     filter["date"] = { $gte: fromDate, $lte: toDate };
  //   } else {
  //     filter["date"] = { $gte: fromDate };
  //   }
  // } else {
  //   if (!isNaN(toDate)) {
  //     filter["date"] = { $lte: toDate };
  //   }
  // }
  UserModel.findOne({ _id: _id })
    .then((user) => {
      const log = user.log.filter((exercise, idx) => {
        if (!limit || limit > idx) {
          if (isNaN(fromDate) || exercise.date >= fromDate) {
            if (isNaN(toDate) || exercise.date <= toDate) {
              return true;
            }
          }
        }
        return false;
      });

      res.json({
        _id: user._id,
        username: user.username,
        count: log.length,
        log: log,
      });

      // ExerciseModel.find(filter)
      //   .limit(limit ? limit : 0)
      //   .then((doc) => {
      //     res.json({
      //       _id: _id,
      //       username: user.username,
      //       count: doc.length,
      //       log: doc,
      //     });
      //   })
      //   .catch((err) => {
      //     res.send(err);
      //   });
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
        const newUser = new UserModel({ username: username, log: [] });
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
  const newExercise = new ExerciseModel({
    description: description,
    duration: duration,
    date: date,
  });
  UserModel.findOneAndUpdate({ _id: userId }, { $push: { log: newExercise } })
    .then((user) => {
      const response = {
        _id: userId,
        username: user.username,
        date: new Date(date).toDateString(),
        duration: duration,
        description: description,
      };
      res.json(response);
    })
    .catch((err) => {
      res.json({ error: err });
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
