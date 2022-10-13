const model = require("./model")

exports.getTopics = (req, res) => {
    return model.selectTopics().then(topics => {
        // console.log("in the controller")
        // console.log({topics})
        res.send({topics})
    }).catch(err => next(err))
}

exports.getArticleById = (req, res, next) => {
    return model.selectArticleById(req.params.article_id)
    .then(articles => {
        res.status(200).send({articles})
    }).catch(err => next(err))
}

exports.getUsers = (req, res, next) => {
    return model.selectUsers().then(users => {
        res.status(200).send({users})
    }).catch(err => next(err))
}

exports.patchArticles = (req, res, next) => {
    return model.updateArticles(req.params.article_id, req.body).then(article => {
        res.send({article})
    }).catch(err => next(err))
}