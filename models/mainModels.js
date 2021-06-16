const dbConn = require("../db/connection");

exports.selectAllTopics = async function () {
  const result = await dbConn.query("SELECT * FROM topics;");
  return result.rows;
};

exports.selectArticleByID = async function (id) {
  const result = await dbConn.query(
    "SELECT * FROM articles WHERE article_id=$1;",
    [id]
  );
  return result.rows[0];
};
