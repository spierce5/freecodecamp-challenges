const app = require('../../index');
const request = require("supertest");

describe("GET /", () => {
  it("should return 200 status code", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /api/whoami", () => {
  it('should return object with ipaddress key', async () => {
    const res = await request(app).get('/api/whoami');
    expect(res.body).toHaveProperty('ipaddress');
  })
})

describe("GET /api/whoami", () => {
  it('should return object with software key', async () => {
    const res = await request(app)
      .get('/api/whoami')
      .set('user-agent', 'super duper cool software');
    expect(res.body).toHaveProperty('software');
  })
})

describe("GET /api/whoami", () => {
  it('should return object with language key', async () => {
    const res = await request(app)
      .get('/api/whoami')
      .set('accept-language', 'en-us');
    expect(res.body).toHaveProperty('language');
  })
})

describe("GET /api/hello", () => {
  it('should return object with greeting key', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.body).toHaveProperty('greeting');
  })
})