const { selectAllTopics, selectArticleByID } = require("../models/mainModels");

exports.getTopics = function (req, res) {
  selectAllTopics().then((topics) => {
    res.send({ topics });
  });
};

exports.getArticleByID = function (req, res) {
  selectArticleByID(req.params.article_id).then((article) =>
    res.send({ article })
  );
};
