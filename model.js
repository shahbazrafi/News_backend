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
            return rows[0]
        }
    })
}

exports.selectUsers = () => {
    return db.query("SELECT * FROM users")
    .then(data => data.rows)
}