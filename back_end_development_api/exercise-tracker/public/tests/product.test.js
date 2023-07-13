const app = require("../../index");
var bodyParser = require("body-parser");
const request = require("supertest");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
    const res = await request(app)
      .post("/api/users/64aa320d0875fe1469072f3b/exercises")
      .send({
        description: `Test ${Date.now()}`,
        duration: 5,
        date: new Date(),
        userId: "64aa320d0875fe1469072f3b",
      })
      .accept("Accept", "application/json");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("date");
    expect(res.body).toHaveProperty("duration");
  });
});

describe("GET /api/users/:_id/logs", () => {
  it("returns a user object with a count property representing the number of exercises that belong to that user.", async () => {
    const res = await request(app).get(
      "/api/users/64aa320d0875fe1469072f3b/logs"
    );
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("log");
    expect(res.body).toHaveProperty("count");
    expect(res.body.log).toBeInstanceOf(Array);
    expect(res.body.count).toBeGreaterThanOrEqual(0);
  });
});
