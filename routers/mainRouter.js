const { Router } = require("express");
const {
  getTopics,
  getArticleByID,
  patchArticleByIDByVotes,
  getAllArticles,
  getArticleCommentsById,
} = require("../controllers/mainControllers");

const router = Router();

router.get("/api/topics", getTopics);

router.get("/api/articles", getAllArticles);
router.get("/api/articles/:article_id", getArticleByID);
router.patch("/api/articles/:article_id", patchArticleByIDByVotes);

// next end point
router.get("/api/articles/:article_id/comments", getArticleCommentsById);

module.exports = router;
