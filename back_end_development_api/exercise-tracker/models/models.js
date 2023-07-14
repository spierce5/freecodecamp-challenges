const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  log: [ExerciseSchema],
});

const UserModel = mongoose.model("User", UserSchema);

const ExerciseModel = mongoose.model("Exercise", ExerciseSchema);

module.exports = { UserModel, ExerciseModel };
