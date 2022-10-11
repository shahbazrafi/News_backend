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
    test('should return the topics list with a slug and description for each', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toBeInstanceOf(Array)
            expect(body.topics).toHaveLength(3)
            body.topics.forEach(topic => {
                expect(topic).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                )
            })
        })
    });
});

describe('4. get /api/articles/:article_id', () => {
    test('should return 200 and an object that matches the article_id for selected columns', () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toEqual({
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100
                })
        })
    });
    test('should return 404 if article_id does not exist', () => {
        return request(app)
        .get("/api/articles/122")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("no article_id found")
        })
    });
})