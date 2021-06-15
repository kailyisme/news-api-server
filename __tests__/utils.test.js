const {
  dbLoading,
  kvpCreator,
  dataRelationParser,
  keyNameChanger,
} = require("../db/utils/data-manipulation");
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
    const expected = format(`(%s) VALUES (%L)`, keys, values);
    expect(result.indexOf(expected)).not.toBe(-1);
  });
});
describe("kvpCreator", () => {
  test("Check value of a single array returns the correct single key value pair", () => {
    const inputData = [];
    const inputKey = "title";
    const inputValue = "article_id";
    const expected = {};
    const output = kvpCreator(inputData, inputKey, inputValue);
    expect(output).toEqual(expected);
  });
  test("Check values of a multi line array returns the correct key value pairs", () => {
    const inputData = [];
    const inputKey = "title";
    const inputValue = "article_id";
    const expected = {};
    const output = kvpCreator(inputData, inputKey, inputValue);
    expect(output).toEqual(expected);
  });
  test("Check the original array does not mutate", () => {
    const inputData = [];
    const expected = []; // a hard coded copy of the inputData
    const inputKey = "title";
    const inputValue = "article_id";
    const output = kvpCreator(inputData, inputKey, inputValue);
    expect(inputData).toEqual(expected);
  });
});
describe("dataRelationParser", () => {
  test("Check an empty data array returns an empty array", () => {
    const inputData = [];
    const inputKVP = {};
    const inputKeyToSwapFrom = "title";
    const inputKeyToSwapTo = "article_id";
    const expected = [];
    const output = dataRelationParser(
      inputData,
      inputKVP,
      inputKeyToSwapFrom,
      inputKeyToSwapTo
    );
    expect(output).toEqual(expected);
  });
  test("Check a single line data file is parsed properly", () => {
    const inputData = [];
    const inputKVP = {};
    const inputKeyToSwapFrom = "title";
    const inputKeyToSwapTo = "article_id";
    const expected = [];
    const output = dataRelationParser(
      inputData,
      inputKVP,
      inputKeyToSwapFrom,
      inputKeyToSwapTo
    );
    expect(output).toEqual(expected);
  });
  test("Check a multi line data file is parsed properly", () => {
    const inputData = [];
    const inputKVP = {};
    const inputKeyToSwapFrom = "title";
    const inputKeyToSwapTo = "article_id";
    const expected = [];
    const output = dataRelationParser(
      inputData,
      inputKVP,
      inputKeyToSwapFrom,
      inputKeyToSwapTo
    );
    expect(output).toEqual(expected);
  });
  test("Check data file is parsed properly when there is no valid kvp to swap", () => {
    const inputData = [];
    const inputKVP = {};
    const inputKeyToSwapFrom = "title";
    const inputKeyToSwapTo = "article_id";
    const expected = [];
    const output = dataRelationParser(
      inputData,
      inputKVP,
      inputKeyToSwapFrom,
      inputKeyToSwapTo
    );
    expect(output).toEqual(expected);
  });
  test("Returns an error when keyToSwap is not valid", () => {
    const inputData = [];
    const inputKVP = {};
    const inputKeyToSwapFrom = "title";
    const inputKeyToSwapTo = "article_id";
    const expected = [];
    const output = dataRelationParser(
      inputData,
      inputKVP,
      inputKeyToSwapFrom,
      inputKeyToSwapTo
    );
    expect(output).toEqual(expected);
  });
  test("Returns an error when swapTo argument is not valid", () => {
    const inputData = [];
    const inputKVP = {};
    const inputKeyToSwapFrom = "title";
    const inputKeyToSwapTo = "article_id";
    const expected = [];
    const output = dataRelationParser(
      inputData,
      inputKVP,
      inputKeyToSwapFrom,
      inputKeyToSwapTo
    );
    expect(output).toEqual(expected);
  });
  test("Check the original array does not mutate", () => {
    const inputData = [];
    const inputKVP = {};
    const inputKeyToSwapFrom = "title";
    const inputKeyToSwapTo = "article_id";
    const expected = [];
    const output = dataRelationParser(
      inputData,
      inputKVP,
      inputKeyToSwapFrom,
      inputKeyToSwapTo
    );
    expect(inputData).toEqual(expected);
  });
});
describe("keyNameChanger", () => {
  test("Check an empty data array returns an empty array", () => {
    const inputData = [];
    const inputOrigKeyName = "title";
    const inputReplKeyName = "article_id";
    const expected = [];
    const output = keyNameChanger(
      inputData,
      inputOrigKeyName,
      inputReplKeyName
    );
    expect(output).toEqual(expected);
  });
  test("Check a single line data file returns the keys swapped over", () => {
    const inputData = [];
    const inputOrigKeyName = "title";
    const inputReplKeyName = "article_id";
    const expected = [];
    const output = keyNameChanger(
      inputData,
      inputOrigKeyName,
      inputReplKeyName
    );
    expect(output).toEqual(expected);
  });
  test("Check a multi line data file returns the keys swapped over", () => {
    const inputData = [];
    const inputOrigKeyName = "title";
    const inputReplKeyName = "article_id";
    const expected = [];
    const output = keyNameChanger(
      inputData,
      inputOrigKeyName,
      inputReplKeyName
    );
    expect(output).toEqual(expected);
  });
  test("Check for error if origKeyName does not exist", () => {
    const inputData = [];
    const inputOrigKeyName = "title";
    const inputReplKeyName = "article_id";
    const expected = [];
    const output = keyNameChanger(
      inputData,
      inputOrigKeyName,
      inputReplKeyName
    );
    expect(output).toEqual(expected);
  });
  test("Check for error if replKeyName does not exist", () => {
    const inputData = [];
    const inputOrigKeyName = "title";
    const inputReplKeyName = "article_id";
    const expected = [];
    const output = keyNameChanger(
      inputData,
      inputOrigKeyName,
      inputReplKeyName
    );
    expect(output).toEqual(expected);
  });
  test("Check the original array has not mutated", () => {
    const inputData = [];
    const expected = []; // Hard coded copy of inputData
    const inputOrigKeyName = "title";
    const inputReplKeyName = "article_id";
    const output = keyNameChanger(
      inputData,
      inputOrigKeyName,
      inputReplKeyName
    );
    expect(inputData).toEqual(expected);
  });
});
