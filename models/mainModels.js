const format = require("pg-format");
const dbConn = require("../db/connection");
const { postgresNumber } = require("../db/utils/data-manipulation");

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

exports.updateArticleVotes = async function (id, newVotes) {
  const result = await dbConn.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
    [newVotes, id]
  );
  return result.rows[0];
};

exports.selectAllArticles = async function (sort_by, order, topic) {
  if (!sort_by) {
    sort_by = `created_at`;
  } else {
    sort_by = format("%s", sort_by);
  }
  if (!order) {
    order = `ASC`;
  } else {
    order = format("%s", order);
  }
  let whereTopic = "";
  if (topic) {
    whereTopic = format("WHERE articles.topic = %L", topic);
  }

  const result = await dbConn.query(
    `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles NATURAL LEFT JOIN comments ${whereTopic} GROUP BY article_id ORDER BY ${sort_by} ${order};`
  );
  if (result.rows.length === 0) {
    const result = await dbConn.query(
      format("SELECT * FROM topics WHERE slug=%L;", topic)
    );
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Invalid Topic" });
    }
  }
  return postgresNumber(result.rows, "comment_count");
};

exports.selectArticleCommentsById = async function (article_id) {
  const result = await dbConn.query(
    "SELECT * FROM comments WHERE article_id = $1;",
    [article_id]
  );
  return result.rows;
};

exports.insertCommentByArticleId = async function (article_id, username, body) {
  const result = await dbConn.query(
    "INSERT INTO comments (author, article_id, body) VALUES ($1, $2, $3) RETURNING *;",
    [username, article_id, body]
  );
  return result.rows;
};

//postgres Error 42703 - errorMissingColumn - not a valid column to sort by?

// exports.selectArticleCommentsById
