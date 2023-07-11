const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("User", UserSchema);

const ExerciseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const ExerciseModel = mongoose.model("Exercise", ExerciseSchema);

module.exports = { UserModel, ExerciseModel };
