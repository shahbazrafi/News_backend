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

describe('9. GET /api/articles/:article_id/comments', () => {
    test('should return 200 and comments', () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toBeInstanceOf(Array)
            expect(body.comments).toHaveLength(11)
            body.comments.forEach(comment => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        article_id: 1,
                        author: expect.any(String),
                        votes: expect.any(Number),
                        created_at: expect.any(String)
                    })
                )
            })
        })
    });
    test('should return 400 and bad request for invalid article id', () => {
        return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("bad request")
        })
    });
    test('should return 404 if article has no comments', () => {
        return request(app)
        .get("/api/articles/10/comments")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("no comments found")
        })
    });
});

describe('10. POST /api/articles/:article_id/comments', () => {
    test('return 201 and new comment', () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({username: "icellusedkars", body:"string of text"})
        .expect(201)
        .then(({body}) => {
            expect(body.comment).toEqual(
                expect.objectContaining({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: 1,
                    author: expect.any(String),
                    votes: 0,
                    created_at: expect.any(String)
                })
            )
        })
    });
    test('return 400 and bad request with invalid input', () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({body:"string of text"})
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("invalid input")
        })
    });
    test('return 400 and bad request with invalid article id', () => {
        return request(app)
        .post("/api/articles/not-an-id/comments")
        .send({username: "icellusedkars", body:"string of text"})
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("bad request")
        })
    });
    test('return 404 and bad request with invalid username', () => {
        return request(app)
        .post("/api/articles/1/comments")
        .send({username: "invalidusername", body:"string of text"})
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("user does not exist")
        })
    });
});