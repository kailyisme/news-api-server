const { Router } = require("express");
const {
  getTopics,
  getArticleByID,
  patchArticleByIDByVotes,
} = require("../controllers/mainControllers");

const router = Router();

router.get("/api/topics", getTopics);
router.get("/api/articles/:article_id", getArticleByID);
router.patch("/api/articles/:article_id", patchArticleByIDByVotes);

module.exports = router;
