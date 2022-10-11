const express = require("express")
const app = express()

const controller = require("./controller")

app.get("/api/topics", controller.getTopics)
app.get("/api/articles/:article_id", controller.getArticleById)
app.get("/api/users", controller.getUsers)

// app.use((err, req, res, next) => {
//     if (err) {
//         console.log(err)
//         res.status(404).send({message: "first error"})
//     }
//     else next(err)
// })
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