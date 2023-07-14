const app = require("../../index");
var bodyParser = require("body-parser");
const request = require("supertest");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const mongoose = require("mongoose");
const { UserModel, ExerciseModel } = require("../../models/models");

describe("POST /api/users", () => {
  it("should return a new user with username 'sam'", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        username: "sam",
      })
      .set("Accept", "application/json");
    expect(res.body).toHaveProperty("username");
    expect(res.body.username).toBe("sam");
  });
});

describe("GET /api/users", () => {
  it("should return 200 status code", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
  });
  it("should return a list", async () => {
    const res = await request(app).get("/api/users");
    expect(res.body).toBeInstanceOf(Array);
  });
});

describe("POST /api/users/:_id/exercises", () => {
  it("The response returned will be the user object with the exercise fields added.", async () => {
    const user = await UserModel.findOne({ username: "sam" });
    const id = user._id;
    const res = await request(app)
      .post(`/api/users/${id}/exercises`)
      .send({
        description: `Test ${Date.now()}`,
        duration: 5,
        date: new Date(),
        userId: "64aa320d0875fe1469072f3b",
      })
      .accept("Accept", "application/json");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("date");
    expect(res.body).toHaveProperty("duration");
  });
});

describe("GET /api/users/:_id/logs", () => {
  it("returns a user object with a count property representing the number of exercises that belong to that user.", async () => {
    const user = await UserModel.findOne({ username: "sam" });
    const id = user._id;
    const res = await request(app).get(`/api/users/${id}/logs`);
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("log");
    expect(res.body).toHaveProperty("count");
    expect(res.body.log).toBeInstanceOf(Array);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.log[0]).toHaveProperty("duration");
    expect(res.body.log[0]).toHaveProperty("description");
    expect(res.body.log[0]).toHaveProperty("date");
  });
});
