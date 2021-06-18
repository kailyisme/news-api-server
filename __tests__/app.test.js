const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const { toBeSortedBy } = require("jest-sorted");
const { readFile } = require("fs/promises");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
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
describe("GET /api/articles", () => {
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
  it("Should return an array of articles as objects sorted by created_at column and ascending order", async () => {
    await request(app)
      .get("/api/articles")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSortedBy("created_at");
      });
  });
  it("Should return an array of articles as objects sorted by votes column", async () => {
    await request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSortedBy("votes");
      });
  });
  it("Should return an array of articles as objects sorted by author column and descending", async () => {
    await request(app)
      .get("/api/articles?order=desc&sort_by=author")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });
  it("Should return an array of articles as objects sorted by comment_count column descending and specific topic", async () => {
    const topic = "mitch";
    await request(app)
      .get(`/api/articles?order=desc&sort_by=comment_count&topic=${topic}`)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSortedBy("comment_count", { descending: true });
        expect(
          articles.every((article) => article.topic === topic)
        ).toBeTruthy();
      });
  });
  it("Should return a 404 (invalid topic) for an invalid specific topic", async () => {
    const topic = "mitc";
    await request(app)
      .get(`/api/articles?order=desc&sort_by=comment_count&topic=${topic}`)
      .expect(404)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const { body } = res;
        expect(body).toEqual({ err: "Invalid Topic" });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("Should return an array of comments for a specific article_id", async function () {
      const article_id = 1;
      await request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then((res) => {
          const { body } = res;
          expect(body.comments).toHaveLength(13);
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                comment_id: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("Should return the correct number of comments for the article_id", function () {
      const article_ids = [2, 5, 6, 9];
      const expectedComments = [0, 2, 1, 2];
      return Promise.all(
        article_ids.map((id, i) => {
          const endpoint = `/api/articles/${id}/comments`;
          return request(app)
            .get(endpoint)
            .expect(200)
            .expect("Content-Type", "application/json; charset=utf-8")
            .then((res) => {
              const { body } = res;
              expect(body.comments).toHaveLength(expectedComments[i]);
            });
        })
      );
    });
  });
  describe("POST", () => {
    it("Returns status 201 and adds comment to a specific article_id", () => {
      const article_id = 1;
      const objectToSend = {
        username: "butter_bridge",
        body: "testing testing, 123",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(objectToSend)
        .expect(201)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then((res) => {
          const { body } = res;
            expect(body.comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(String),
                author: objectToSend.username,
                article_id,
                votes: 0,
                created_at: expect.any(String),
                body: objectToSend.body,
              })
            );
        });
    });
  });
});
describe("GET /api", () => {
  it("Returns status 200 and serves the endpoints.json file (usage examples object)", async () => {
    const expected = JSON.parse(await readFile("./endpoints.json"));
    request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8")
      .then((res) => {
        const { body } = res;
        expect(body).toEqual(expected);
      });
  });
});
