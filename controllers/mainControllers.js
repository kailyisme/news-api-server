const {
  selectAllTopics,
  selectArticleByID,
  updateArticleVotes,
  selectAllArticles,
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

// added the following
exports.getAllArticles = function (req, res) {
  console.log(req.query, "<<query");
  selectAllArticles(req.query.sort_by, req.query.order, req.query.topic).then(
    (articles) => {
      res.send({ articles });
    }
  );
};

exports.getArticleCommentsById = function (req, res) {
  selectArticleCommentsById(xxxxxx).then((comments) => {
    res.send({ comments });
  });
};
