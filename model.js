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
            console.log(rows[0], article_id)
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

exports.updateArticles = (article_id, data) => {
    return db.query(`SELECT votes FROM articles WHERE article_id=$1`, [article_id])
    .then(data => {
        return data.rows[0]
    }).then(({votes}) => {
        votes+=data.inc_votes
        return db.query(`UPDATE articles SET votes=$2 WHERE article_id=$1 RETURNING *`, [article_id, votes])
    }).then(({rows}) => rows[0])
}