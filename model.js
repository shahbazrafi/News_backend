const { DataRowMessage } = require("pg-protocol/dist/messages")
const db = require("./db/connection")
const utils = require("./db/seeds/utils")

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics")
    .then(data => data.rows)
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({rows}) => {
        if (rows.length ===0){
            return Promise.reject({status: 404, message: "no article_id found"})
        } else {
            return {author: rows[0].author, title: rows[0].title, article_id: rows[0].article_id, body: rows[0].body, topic: rows[0].topic, created_at: rows[0].created_at, votes: rows[0].votes}
        }
    })
}