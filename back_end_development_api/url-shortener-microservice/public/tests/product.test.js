const app = require("../../index");
var bodyParser = require("body-parser");
const request = require("supertest");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

describe("POST /api/shorturl", () => {
  it("should return 400 status code", async () => {
    const res = await request(app)
      .post("/api/shorturl")
      .send({ url: "john" })
      .set("Accept", "application/json");
    expect(res.statusCode).toBe(400);
  });

  it("should return 200 status code", async () => {
    const res = await request(app)
      .post("/api/shorturl")
      .send({ url: "google.com" })
      .set("Accept", "application/json");
    expect(res.statusCode).toBe(200);
  });
});

describe("POST /api/shorturl", () => {
  it("should return { error: 'Invalid URL'}", async () => {
    const res = await request(app)
      .post("/api/shorturl")
      .send({ url: "@@#123" })
      .set("Accept", "application/json");
    expect(res.body).toEqual({ error: "Invalid URL" });
  });

  it("should return { original_url: 'google.com'}", async () => {
    const res = await request(app)
      .post("/api/shorturl")
      .send({ url: "google.com" })
      .set("Accept", "application/json");
    expect(res.body).toMatchObject({ original_url: "google.com" });
  });
});

describe("GET /api/shorurl/:num", () => {
  it("should return status 301 for shorturl 2", async () => {
    const res = await request(app).get("/api/shorturl/2");
    expect(res.statusCode).toBe(301);
    console.log(res.headers.location);
  });

  it("should redirect to https://samuel-pierce.vercel.app", async () => {
    const res = await request(app).get("/api/shorturl/2");
    expect(res.headers.location).toEqual("https://samuel-pierce.vercel.app");
  });

  it("should return status 404 for shorturl 99999999999", async () => {
    const res = await request(app).get("/api/shorturl/99999999999");
    expect(res.statusCode).toBe(404);
  });
});
