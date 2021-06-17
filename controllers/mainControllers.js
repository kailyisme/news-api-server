const {
  selectAllTopics,
  selectArticleByID,
  updateArticleVotes,
  selectAllArticles,
  selectArticleCommentsById,
} = require("../models/mainModels");

// GET /api/topics
exports.getTopics = function (req, res) {
  selectAllTopics().then((topics) => {
    res.send({ topics });
  });
};
// GET /api/articles/:article_id
exports.getArticleByID = function (req, res) {
  selectArticleByID(req.params.article_id).then((article) =>
    res.send({ article })
  );
};
// PATCH /api/articles/:article_id
exports.patchArticleByIDByVotes = function (req, res) {
  const incVotesBy = req.body.inc_votes;
  updateArticleVotes(req.params.article_id, incVotesBy).then((article) =>
    res.send({ article })
  );
};
// GET /api/articles
exports.getAllArticles = function (req, res, next) {
  const { sort_by, order, topic } = req.query;
  selectAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.send({ articles });
    })
    .catch(next);
};
// GET /api/articles/:article_id/comments
// added the following
exports.getArticleCommentsById = function (req, res, next) {
  const { article_id } = req.params;
  selectArticleCommentsById(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};
