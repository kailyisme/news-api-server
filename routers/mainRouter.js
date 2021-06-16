const { Router } = require("express");
const { getTopics, getArticleByID } = require("../controllers/mainControllers");

const router = Router();

router.get("/api/topics", getTopics);
router.get("/api/articles/:article_id", getArticleByID);

module.exports = router;
