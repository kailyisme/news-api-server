const {
  selectAllTopics,
  selectArticleByID,
  updateArticleVotes,
} = require("../models/mainModels");

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

exports.patchArticleByIDByVotes = function (req, res) {
  const incVotesBy = req.body.inc_votes;
  updateArticleVotes(req.params.article_id, incVotesBy).then((article) =>
    res.send({ article })
  );
};
