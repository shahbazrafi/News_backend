const db = require("./db/connection")
const utils = require("./db/seeds/utils")

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics")
    .then(data => data.rows)
}

exports.selectArticleById = (article_id) => {
    console.log(article_id)
    return db.query(`SELECT * FROM articles JOIN users ON articles.author=users.username WHERE article_id=${article_id}`)
    .then(({rows}) => {
        return {author: rows[0].username, title: rows[0].title, article_id: rows[0].article_id, body: rows[0].body, topic: rows[0].topic, created_at: rows[0].created_at, votes: rows[0].votes}
    })
}