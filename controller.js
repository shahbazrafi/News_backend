const model = require("./model")

exports.getTopics = (req, res) => {
    return model.selectTopics().then(data => {
        console.log("in the controller")
        console.log(data)
        res.send()
    })
}