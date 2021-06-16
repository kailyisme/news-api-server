const { selectAllTopics } = require("../models/mainModels");

exports.getTopics = function (req, res) {
  selectAllTopics().then((result) => {
    res.send({ topics: result });
  });
};
