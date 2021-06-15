const { dbLoading } = require("../db/utils/data-manipulation");
const format = require("pg-format");

describe("dbLoading", () => {
  test("table name should be the correct one", () => {
    const table_name = "comments";
    const data = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
    ];
    const result = dbLoading(table_name, data);
    const expected = `INSERT INTO ${table_name}`;
    //console.log(result);
    expect(result.startsWith(expected)).toBeTruthy();
  });
  test("check the key value pairs are correct", () => {
    const table_name = "comments";
    const data = [
      {
        body: "Oh!",
        belongs_to: "They're not exactly cats?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
    ];
    const result = dbLoading(table_name, data);
    const keys = Object.keys(data[0]);
    const values = keys.map((key) => data[0][key]);
    const expected = format(`(%s) VALUES (%L)`,keys,values);
    expect(result.indexOf(expected)).not.toBe(-1);
  });
});
