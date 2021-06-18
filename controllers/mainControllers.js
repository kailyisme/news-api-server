const {
  selectAllTopics,
  selectArticleByID,
  updateArticleVotes,
  selectAllArticles,
  selectArticleCommentsById,
  insertCommentByArticleId,
  parseEndpoints,
} = require("../models/mainModels");

// GET /api/topics
exports.getTopics = function (req, res, next) {
  selectAllTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch(next);
};
// GET /api/articles/:article_id
exports.getArticleByID = function (req, res, next) {
  selectArticleByID(req.params.article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Invalid Article ID" });
      } else res.send({ article });
    })
    .catch(next);
};
// PATCH /api/articles/:article_id
exports.patchArticleByIDByVotes = function (req, res, next) {
  const incVotesBy = req.body.inc_votes;
  updateArticleVotes(req.params.article_id, incVotesBy)
    .then((article) => res.send({ article }))
    .catch(next);
};
// GET /api/articles
exports.getAllArticles = function (req, res, next) {
  const { sort_by, order, topic } = req.query;
  selectAllArticles(sort_by, order, topic)
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid Topic" });
      }
      res.send({ articles });
    })
    .catch(next);
};
// GET /api/articles/:article_id/comments
exports.getArticleCommentsById = function (req, res, next) {
  const { article_id } = req.params;
  selectArticleCommentsById(article_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};
// POST /api/articles/:article_id/comments
exports.postArticleCommentById = function (req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
// GET /api
exports.getEndpoints = async function (req, res, next) {
  const endPoints = await parseEndpoints().catch(next);
  res.send(endPoints);
};
