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
  // then need to sort_by any column
  // const validColumnsForSorting = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes'];
  // if(!validColumnsForSorting.includes(sort_by)) {return Promise.reject({status: 400, msg: 'Invalid sort_by column'})};
  // Revised query is therefore:-
  //const result = await dbConn.query("SELECT *, COUNT(article_id) AS number_of_articles FROM articles LEFT JOIN comments ON comments.belongs_to = articles.title ORDER BY ${sort_by} ASC;");

  // then need to order using ORDER BY ASC or DESC
  // Revised query is therefore:-
  //const result = await dbConn.query("SELECT *, COUNT(article_id) AS number_of_articles FROM articles LEFT JOIN comments ON comments.belongs_to = articles.title ORDER BY ${sort_by} ${order};");

  // then need to filter by topic
  //

  return postgresNumber(result.rows, "comment_count");
};

//postgres Error 42703 - errorMissingColumn - not a valid column to sort by?

// exports.selectArticleCommentsById
