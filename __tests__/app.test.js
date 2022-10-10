const request = require("supertest")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const app = require("../app")
const seed = require("../db/seeds/seed")

afterAll(() => {
    db.end();
  });

beforeEach(() => {
    return seed(data)
})

describe('3. get /api/topics', () => {
    test('returns 200 status', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
    });
});