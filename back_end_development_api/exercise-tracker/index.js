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
	const { _id } = req.params;
	const { from, to, limit } = req.query;
	const fromDate = new Date(from);
	const toDate = new Date(to);
	console.log(
		{
			userId: _id,
			fromDate: fromDate,
			toDate: toDate,
			...req.query
		}
	)

	if (from && isNaN(fromDate)) {
		res.json({ error: "Could not parse from-date.", value: fromDate });
	}

	if (to && isNaN(toDate)) {
		res.json({ error: "Could not parse to-date.", value: toDate });
	}

	UserModel.findOne({ _id: _id })
		.then((user) => {
			const log = user.log
				.filter((exercise) => {
					// if (!limit || limit > idx) {
					if (!from || isNaN(fromDate) || exercise.date >= fromDate) {
						// if (isNaN(fromDate) || exercise.date >= fromDate) {
						if (!to || isNaN(toDate) || exercise.date <= toDate) {
							// if (isNaN(toDate) || exercise.date <= toDate) {
							return true;
						}
					}
					// }
					return false;
				}).filter((exercise, idx) => {
					if (!limit || limit > idx) {
						return true
					}
				})
				.map((exercise) => {
					return {
						duration: exercise.duration,
						description: exercise.description,
						date: formatDate(exercise.date),
					};
				});

			res.json({
				_id: user._id,
				username: user.username,
				count: log.length,
				log: log,
			});
		})
		.catch((err) => {
			res.send(err);
		});
});

app.post("/api/users", (req, res) => {
	const { username } = req.body;

	UserModel.findOne({ username: username })
		.then((doc) => {
			if (doc) {
				const { username, _id } = doc;
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
	let { description, duration, date } = req.body;

	// console.log(
	// 	`ID: ${userId}
	//     description: ${description} - ${typeof description}, 
	//     duration: ${duration} - ${typeof duration}, 
	//     date: ${date} - ${typeof date}
	//    `
	// );

	if (!date || date === "") {
		date = new Date();
	} else {
		if (isNaN(new Date(date))) {
			throw new Error(`Invalid date: ${date}`);
		}
	}

	if (description === "" || description === null || !description) {
		throw new Error(
			`Description required. Values: { description: ${description} }, { duration: ${duration} }, { date: ${date} }`
		);
	}

	if (duration === "" || duration === null) {
		throw new Error("Duration required");
	}

	if (duration && isNaN(duration)) {
		throw new Error(`Duration must be a number. Value provided: ${duration}`);
	}

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
				date: formatDate(new Date(date)),
				duration: parseFloat(duration),
				description: description,
			};
			res.json(response);
		})
		.catch((err) => {
			res.json({ error: err });
		});
});

const formatDate = (date) => {
	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const dayNum =
		date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate();
	let fmtDate = `${dayNames[date.getUTCDay()]} ${monthNames[date.getUTCMonth()]
		} ${dayNum} ${date.getUTCFullYear()}`;
	return fmtDate;
};

const start = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://spierce:acUwpTlEhrwb9HtZ@cluster0.4xckye0.mongodb.net/?retryWrites=true&w=majority"
		);
		app.listen(port, function() {
			console.log(`Listening on port ${port}`);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

start();

module.exports = app;
