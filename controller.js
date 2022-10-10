const model = require("./model")

exports.getTopics = (req, res) => {
    return model.selectTopics().then(topics => {
        // console.log("in the controller")
        // console.log({topics})
        res.send({topics})
    }).catch(err => next(err))
}

exports.getArticleById = (req, res) => {
    return model.selectArticleById(req.params.article_id).then(articles => {
        console.log({articles})
        res.send({articles})
    }).catch(err => next(err))
}