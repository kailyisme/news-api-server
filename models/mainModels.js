const format = require("pg-format");
const dbConn = require("../db/connection");
const { postgresNumber } = require("../db/utils/data-manipulation");
const fs = require("fs/promises");

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
    `SELECT articles.*, COUNT(comments.comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    ${whereTopic} 
    GROUP BY articles.article_id 
    ORDER BY ${sort_by} ${order};`
  );
  if (result.rows.length === 0) {
    const result = await dbConn.query(
      format("SELECT * FROM topics WHERE slug=%L;", topic)
    );
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
  return result.rows[0];
};

exports.parseEndpoints = async function () {
  const endPointFile = await fs.readFile("./endpoints.json");
  return JSON.parse(endPointFile);
};

//postgres Error 42703 - errorMissingColumn - not a valid column to sort by?

// exports.selectArticleCommentsById
