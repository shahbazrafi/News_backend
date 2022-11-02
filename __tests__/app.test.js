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

describe('4. get /api/articles/:article_id + 7. comment_count', () => {
    test('should return 200 and an object that matches the article_id for selected columns', () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toEqual(
                expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                }))
        })
    });
    test('should return 400 with invalid input', () => {
        return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("bad request")
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

describe('5. get /api/users', () => {
    test('returns 200', () => {
        return request(app)
        .get("/api/users")
        .expect(200)
    });
    test('returns 200 and users', () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            expect(body.users).toBeInstanceOf(Array)
            expect(body.users).toHaveLength(4)
            body.users.forEach(user => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                )
            })
        })
    });
});

describe('6', () => {
    test('returns 400 missing body error', () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ wrong_send : 55})
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("missing body error")
        })
    });
    test('should return 400 with invalid input', () => {
        return request(app)
        .patch("/api/articles/banana")
        .send({ inc_votes : 55})
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("bad request")
        })
    });
    test('should return 404 if article_id does not exist', () => {
        return request(app)
        .patch("/api/articles/122")
        .send({ inc_votes : 55})
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("no article_id found")
        })
    });
    test('returns 200 and updated article', () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes : 55})
        .expect(200)
        .then(({body}) => {
            expect(body.article).toEqual(
                expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                }))
        })
    });
});

describe('12. DELETE /api/comments/:comment_id', () => {
    test('returns 204', () => {
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
    });
    test('returns 404 for comment_id that doesnt exist yet', () => {
        return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("no comment_id found")
        })
    });
    test('returns 400 for invalid comment_id', () => {
        return request(app)
        .delete("/api/comments/not-an-id")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("bad request")
        })
    });
});