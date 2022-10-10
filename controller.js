const model = require("./model")

exports.getTopics = (req, res) => {
    return model.selectTopics().then(topics => {
        console.log("in the controller")
        console.log(topics)
        res.send({topics})
    })
}