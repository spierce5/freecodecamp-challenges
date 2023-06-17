const request = require("supertest");
const app = require("../../MyApp");
// require("dotenv").config();npm

describe("GET /api/2015-12-25", () => {
  it("should return conversions", async () => {
    const res = await request(app).get("/api/2015-12-25");
    expect(res.statusCode).toBe(200);
    expect(res.body.unix).toBe(1451001600000)
    expect(res.body.utc).toBe('Fri, 25 Dec 2015 00:00:00 GMT')
  });
});

describe("GET /api/1451001600000", () => {
  it("should return unix and utc conversions", async () => {
    const res = await request(app).get("/api/1451001600000");
    expect(res.statusCode).toBe(200);
    expect(res.body.unix).toBe(1451001600000)
    expect(res.body.utc).toBe('Fri, 25 Dec 2015 00:00:00 GMT')
  });
});

describe("GET /api/1970-01-01", () => {
  it("should return conversions", async () => {
    const res = await request(app).get("/api/1970-01-01");
    expect(res.statusCode).toBe(200);
    expect(res.body.unix).toBe(0)
    expect(res.body.utc).toBe('Thu, 01 Jan 1970 00:00:00 GMT')
  });
});

describe("GET /api/1600000", () => {
  it("should return unix and utc conversions", async () => {
    const res = await request(app).get("/api/1600000");
    expect(res.statusCode).toBe(200);
    expect(res.body.unix).toBe(1600000)
    expect(res.body.utc).toBe('Thu, 01 Jan 1970 00:26:40 GMT')
  });
});

describe("GET /api/-604022400000", () => {
  it("should return unix and utc conversions", async () => {
    const res = await request(app).get("/api/-604022400000");
    expect(res.statusCode).toBe(200);
    expect(res.body.unix).toBe(-604022400000)
    expect(res.body.utc).toBe('Sat, 11 Nov 1950 00:00:00 GMT')
  });
});

describe("GET /api/", () => {
  it("should return unix and utc conversions", async () => {
    let date = new Date();
    let upper = new Date(date.getTime() + 10000);
    let lower = new Date(date.getTime() - 10000);
    
    const res = await request(app).get("/api/");
    expect(res.statusCode).toBe(200);
    expect(res.body.unix).toBeLessThanOrEqual(upper.getTime())
    expect(res.body.unix).toBeGreaterThanOrEqual(lower.getTime())
    expect(new Date(Date.parse(res.body.utc)).getTime()).toBeLessThanOrEqual(upper.getTime())
    expect(new Date(Date.parse(res.body.utc)).getTime()).toBeGreaterThanOrEqual(lower.getTime())
  });
});

describe("GET /api/abc", () => {
  it("should return an error object", async () => {
    const res = await request(app).get("/api/abc");
    expect(res.body).toHaveProperty('error', "Invalid Date");
  })
})