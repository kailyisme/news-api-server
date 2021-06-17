const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
  it("Should return an array of topics as objects under topics as key", async () => {
    await request(app)
      .get("/api/topics")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const { body } = res;
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    it("Should return an article object under an article key", async () => {
      const articleIDExpected = 4;
      await request(app)
        .get(`/api/articles/${articleIDExpected}`)
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then((res) => {
          const { body } = res;
          expect(body.article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
  });

  describe("PATCH", () => {
    it("Should change the votes of an article by a given amount", async () => {
      const originalVotes = 100;
      const changeVotesBy = 10;
      const articleID = 1;
      const objectToSend = { inc_votes: changeVotesBy };
      await request(app)
        .patch(`/api/articles/${articleID}`)
        .send(objectToSend)
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then((res) => {
          const { body } = res;
          expect(body.article.votes).toBe(originalVotes + changeVotesBy);
          expect(body.article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
  });
});

// added the following test

describe("/api/articles", () => {
  it("Should return an array of articles as objects ", async () => {
    await request(app)
      .get("/api/articles")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const { body } = res;
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});
