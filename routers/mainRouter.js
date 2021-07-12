const { Router } = require("express");
const {
  getTopics,
  getArticleByID,
  patchArticleByIDByVotes,
  getAllArticles,
  getArticleCommentsById,
  postArticleCommentById,
  getEndpoints,
} = require("../controllers/mainControllers");

const router = Router();

router.get("/api", getEndpoints);
router.get("/api/topics", getTopics);

router.get("/api/articles", getAllArticles);
router.get("/api/articles/:article_id", getArticleByID);
router.patch("/api/articles/:article_id", patchArticleByIDByVotes);

router.get("/api/articles/:article_id/comments", getArticleCommentsById);
router.post("/api/articles/:article_id/comments", postArticleCommentById);

module.exports = router;
