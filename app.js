const express = require("express")
const app = express()

const controller = require("./controller")

app.get("/api/topics", controller.getTopics)

module.exports  = app