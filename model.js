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
            return db.query(`SELECT * FROM comments WHERE article_id=$1`, [article_id])
            .then(data => {
                rows[0].comment_count=data.rows.length
                return rows[0]
            })
        }
    })
}

exports.selectUsers = () => {
    return db.query("SELECT * FROM users")
    .then(data => data.rows)
}

exports.updateArticles = (article_id, body) => {
    if (body.inc_votes === undefined ) {
        return Promise.reject({status: 400, message: "missing body error"})
    }
    return db.query(`UPDATE articles SET votes=votes+$2 WHERE article_id=$1 RETURNING *`, [article_id, body.inc_votes])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, message: "no article_id found"})
        } else {
            return rows[0]
        }
    })
}

exports.removeComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id])
}