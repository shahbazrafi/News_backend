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

describe('8. get /api/articles/', () => {
    test('should return 200 and articles sorted by date', () => {
        return request(app)
        .get("/api/articles/")
        .expect(200)
        .then(({body}) => {
            body.articles.forEach(article => {
                expect(article).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                )
            })
        })
    });
    test('should return 200 and articles sorted by date and topic', () => {
        return request(app)
        .get("/api/articles/?topic=mitch")
        .expect(200)
        .then(({body}) => {
            body.articles.forEach(article => {
                expect(article).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: "mitch",
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                )
            })
        })
    });
    test('should return 404 and articles not found with invalid topic', () => {
        return request(app)
        .get("/api/articles/?topic=banana")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("no articles found")
        })
    });
})

describe('11. GET /api/articles (queries)', () => {
    test('returns 200 with valid sort_by input', () => {
        return request(app)
        .get("/api/articles/?sort_by=title")
        .expect(200)
        .then(({body}) => {
            body.articles.forEach(article => {
                expect(article).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                )
            })

        })  
    });
    test('returns 200 with valid sort_by input', () => {
        return request(app)
        .get("/api/articles/?order=ASC")
        .expect(200)
        .then(({body}) => {
            body.articles.forEach(article => {
                expect(article).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                )
            })

        })  
    });    
    test('returns 400 with invalid sort_by input', () => {
        return request(app)
        .get("/api/articles/?sort_by=banana&order=ASC")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("invalid input")
        })  
    });
    test('returns 400 with invalid order input', () => {
        return request(app)
        .get("/api/articles/?sort_by=title&order=banana")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe("invalid input")
        })  
    });
});