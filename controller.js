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

exports.getArticle = (req, res, next) => {
    return model.selectArticles(req.query.topic, req.query.sort_by, req.query.order)
    .then(articles => {
        res.status(200).send({articles})
    }).catch(err => next(err))
}

exports.getCommentsByArticleId = (req, res, next) => {
    return model.selectComments(req.params.article_id).then(comments => {
        res.status(200).send({comments})
    }).catch(err => next(err))
}

exports.postCommentToArticleId = (req, res, next) => {
    return model.insertComment(req.params.article_id, req.body).then(comment => {
        res.status(201).send({comment})
    }).catch(err => next(err))
}

exports.deleteComment = (req, res, next) => {
    return model.removeComment(req.params.comment_id).then(() => {
        res.status(204).send()
    }).catch(err => next(err))
}