const model = require("./model")

exports.getTopics = (req, res, next) => {
    return model.selectTopics().then(topics => {
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
        res.send({users})
    }).catch(err => next(err))
}