const format = require("pg-format");
const dbConnection = require("../connection");
const { dbLoading } = require("../utils/data-manipulation");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  return dbConnection
    .query(
      `
  DROP TABLE IF EXISTS comments;
  DROP TABLE IF EXISTS articles;
  DROP TABLE IF EXISTS topics;
  DROP TABLE IF EXISTS users;
  `
    )
    .then(() =>
      dbConnection.query(`
    CREATE TABLE users (
        username VARCHAR (32) PRIMARY KEY,
        avatar_url VARCHAR (2048) DEFAULT 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        name VARCHAR (64) NOT NULL
    );
    
    CREATE TABLE topics (
        slug VARCHAR (32) PRIMARY KEY,
        description VARCHAR (255) 
    );
    
    CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR (255) NOT NULL,
        body VARCHAR (2048) NOT NULL,
        votes INT DEFAULT 0,
        topic VARCHAR (32),
        FOREIGN KEY (topic) REFERENCES topics(slug),
        author VARCHAR (32) NOT NULL,
        FOREIGN KEY (author) REFERENCES users(username),
        created_at DATE DEFAULT NOW()
    );
    
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    CREATE TABLE comments (
        comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author VARCHAR (32), FOREIGN KEY (author) REFERENCES users(username),
        article_id INT NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles(article_id),
        votes INT DEFAULT 0,
        created_at DATE DEFAULT NOW(),
        body VARCHAR (2048) NOT NULL
    )
  `)
    )
    .then(() => {
      return dbConnection.query(dbLoading("users", userData));
    })
    .then(() => {
      return dbConnection.query(dbLoading("topics", topicData));
    })
    .then(() => {
      return dbConnection.query(dbLoading("articles", articleData));
    })
    .then(() => {
      const kvp = {};
      articleData.forEach((element, i) => {
        kvp[element.title] = i + 1;
      });
      // console.log(kvp);
      const modifiedCommentData = commentData.map((comment) => {
        const { body, belongs_to, created_by, votes, created_at } = comment;
        const article_id = kvp[belongs_to];
        return {
          author: created_by,
          body,
          votes,
          created_at,
          article_id,
        };
      });
      return dbConnection.query(dbLoading("comments", modifiedCommentData));
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = seed;
