\c nc_news_test;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    username VARCHAR (32) PRIMARY KEY,
    avatar_url VARCHAR (2048) DEFAULT 'https://immersivelrn.org/wp-content/uploads/no_avatar.jpg',
    name VARCHAR (64)
);

CREATE TABLE topics (
    slug VARCHAR (32) PRIMARY KEY,
    description VARCHAR (255)
);

CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR (255),
    body VARCHAR (2048),
    votes INT DEFAULT 0,
    topic VARCHAR (32),
    FOREIGN KEY (topic) REFERENCES topics(slug),
    author VARCHAR (32),
    FOREIGN KEY (author) REFERENCES users(username),
    created_at DATE DEFAULT NOW()
);

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE comments (
    comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author VARCHAR (32), FOREIGN KEY (author) REFERENCES users(username),
    article_id INT,
    FOREIGN KEY (article_id) REFERENCES articles(article_id),
    votes INT DEFAULT 0,
    created_at DATE DEFAULT NOW(),
    body VARCHAR (2048)
)