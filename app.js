const express = require("express")
const app = express()

const controller = require("./controller")
app.use(express.json())

app.get("/api/articles/:article_id/comments", controller.getCommentsByArticleId)
app.get("/api/topics", controller.getTopics)
app.get("/api/articles/:article_id", controller.getArticleById)
app.get("/api/users", controller.getUsers)
app.patch("/api/articles/:article_id", controller.patchArticles)

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({message: "bad request"})
    }
    else next(err)
})
app.use((err, req, res, next) => {
    if (err.message && err.status) {
        res.status(err.status).send({message: err.message})
    }
    else next(err)
})
app.use((err, req, res, next) => {
    res.status(500).send("server error")
})

module.exports  = app