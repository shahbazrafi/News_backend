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

exports.selectComments = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`, [article_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, message: "no comments found"})
        } else {
            return rows
        }
    })
}

exports.insertComment = (article_id, comment) => {
    if (!comment.username || !comment.body) {
        return Promise.reject({status: 400, message: "invalid input"})
    }
    return db.query("SELECT * FROM users")
    .then(({rows})=> {if (rows.every(({username})=> username!==comment.username)) return Promise.reject({status: 404, message: "user does not exist"})})
    .then(() => db.query(`INSERT INTO comments (article_id, body, author) VALUES ($3, $1, $2) RETURNING *;`, [comment.body, comment.username, article_id])
    .then((data) => {
        return data.rows[0]
    }))
}