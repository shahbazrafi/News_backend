const express = require("express")
const app = express()

const controller = require("./controller")

app.get("/api/topics", controller.getTopics)
app.get("/api/articles/:article_id", controller.getArticleById)

module.exports  = app