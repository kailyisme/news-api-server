const { Router } = require("express");
const { getTopics } = require("../controllers/mainControllers");

const router = Router();

router.get("/api/topics", getTopics);

module.exports = router;
