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

exports.selectArticles = (topic, sort_by = "created_at", order = "DESC") => {
    let insert = "", array = []
    if (topic) {
        insert = "WHERE topic = $1"
        array.push(topic)
    }
    const validColumns = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count']
    const validOrders = ["ASC", "DESC"]
    if (!validColumns.includes(sort_by) || !validOrders.includes(order)){
        return Promise.reject({status: 400, message: "invalid input"})
    }
    return db.query(`SELECT * FROM articles ${insert} ORDER BY ${sort_by} ${order}`, array)
    .then(({rows}) => {
        if (rows.length ===0){
            return Promise.reject({status: 404, message: "no articles found"})
        } else {
            return Promise.all(rows.map((article) => {
                return db.query(`SELECT * FROM comments WHERE article_id=$1`, [article.article_id])
                .then(data => {
                    article.comment_count=data.rows.length
                })
            }))
            .then(() => {
                return rows
            })
        }
    })
}