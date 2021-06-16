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
  test("check the key value pairs are correct when more than one row", () => {
    const table_name = "comments";
    const data = [
      {
        body: "Oh!",
        belongs_to: "They're not exactly cats?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
      {
        body: "Test!",
        belongs_to: "They're not exactly dogs or ducks?",
        created_by: "Mike and Kaily",
        votes: 99999999,
        created_at: new Date(1586179990000),
      },
    ];
    const result = dbLoading(table_name, data);
    const keys1 = Object.keys(data[0]);
    const keys2 = Object.keys(data[1]);
    const values1 = keys1.map((key) => data[0][key]);
    const values2 = keys2.map((key) => data[1][key]);
    const expected1 = format(`(%s) VALUES (%L)`, keys1, values1);
    const expected2 = format(`(%s) VALUES (%L)`, keys2, values2);
    expect(result.indexOf(expected1)).not.toBe(-1);
    expect(result.indexOf(expected2)).not.toBe(-1);
    const insertIntoToMatch = `INSERT INTO ${table_name}`;
    const tableNameRegEx = new RegExp(insertIntoToMatch, "gi");
    expect(result.match(tableNameRegEx).length).toBe(2);
  });

  test("check if the query order is correct", () => {
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
    const expectedRegEx = /INSERT INTO .* VALUES .*;/i;
    expect(expectedRegEx.test(result)).toBeTruthy();
  });

  test("Check original array does not mutate", () => {
    const table_name = "comments";
    let data = [
      {
        body: "Oh!",
        belongs_to: "They're not exactly cats?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
    ];
    const data_copy = [
      {
        body: "Oh!",
        belongs_to: "They're not exactly cats?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
    ];
    const result = dbLoading(table_name, data);
    expect(data).toEqual(data_copy);
  });
});

describe("kvpCreator", () => {
  test("Check the correct keys are returned", () => {
    const inputData = [
      {
        rows: [
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-07-08T23:00:00.000Z",
          },
        ],
      },
    ];
    const inputKey = "title";
    const inputValue = "article_id";
    const expectedKeys = ["article_id", "title"];
    const output = kvpCreator(inputData, inputKey, inputValue);
    expect(Object.keys(output[0]).length).toBe(2);
    expect(expectedKeys.every((key) => key in output[0])).toBeTruthy();
    // a right hand thingy
  });
  test("Check value of a single array returns the correct single key value pair", () => {
    const inputData = [
      {
        rows: [
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-07-08T23:00:00.000Z",
          },
        ],
      },
    ];
    const inputKey = "title";
    const inputValue = "article_id";
    const expected = [
      { title: "Living in the shadow of a great man", article_id: 1 },
    ];
    const output = kvpCreator(inputData, inputKey, inputValue);
    expect(output).toEqual(expected);
  });
  test("Check values of a multi line array returns the correct key value pairs", () => {
    const inputData = [
      {
        rows: [
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-07-08T23:00:00.000Z",
          },
        ],
      },
      {
        rows: [
          {
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            body: "Call me Mitchell.",
            votes: 0,
            topic: "mitch",
            author: "icellusedkars",
            created_at: "2020-10-15T23:00:00.000Z",
          },
        ],
      },
    ];
    const inputKey = "title";
    const inputValue = "article_id";
    const expected = [
      { title: "Living in the shadow of a great man", article_id: 1 },
      { title: "Sony Vaio; or, The Laptop", article_id: 2 },
    ];
    const output = kvpCreator(inputData, inputKey, inputValue);
    expect(output).toEqual(expected);
  });
  test("Check the original array does not mutate", () => {
    const inputData = [
      {
        rows: [
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-07-08T23:00:00.000Z",
          },
        ],
      },
    ];
    const inputDataCopy = [
      {
        rows: [
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2020-07-08T23:00:00.000Z",
          },
        ],
      },
    ];
    const inputKey = "title";
    const inputValue = "article_id";
    kvpCreator(inputData, inputKey, inputValue);
    expect(inputData).toEqual(inputDataCopy);
  });
});

describe("dataRelationParser", () => {
  test("Check an empty data array returns an empty array", () => {
    const inputData = [];
    const inputKVP = [
      { title: "Living in the shadow of a great man", article_id: 1 },
      { title: "Sony Vaio; or, The Laptop", article_id: 2 },
    ];
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
    const inputData = [
      {
        body: "Oh, I've got compassion running out of my nose",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: "2020-04-06T13:17:00.000Z",
      },
    ];
    const inputKVP = [
      { title: "Living in the shadow of a great man", article_id: 1 },
      { title: "Sony Vaio; or, The Laptop", article_id: 2 },
      { title: "They're not exactly dogs, are they?", article_id: 9 },
    ];
    const inputKeyToSwapFrom = "belongs_to";
    const inputKeyToSwapTo = "article_id";
    const expected = [
      {
        body: "Oh, I've got compassion running out of my nose",
        article_id: 9,
        created_by: "butter_bridge",
        votes: 16,
        created_at: "2020-04-06T13:17:00.000Z",
      },
    ];
    const output = dataRelationParser(
      inputData,
      inputKVP,
      inputKeyToSwapFrom,
      inputKeyToSwapTo
    );
    expect(output).toEqual(expected);
  });
  test("Check a multi line data file is parsed properly", () => {
    const inputData = [
      {
        body: "Oh, I've got compassion running out of my nose",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: "2020-04-06T13:17:00.000Z",
      },
      {
        body: "The beautiful thing about treasure is that it exists.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: "2020-10-31T03:03:00.000Z",
      },
    ];
    const inputKVP = [
      { title: "Living in the shadow of a great man", article_id: 1 },
      { title: "Sony Vaio; or, The Laptop", article_id: 2 },
      { title: "They're not exactly dogs, are they?", article_id: 9 },
    ];
    const inputKeyToSwapFrom = "belongs_to";
    const inputKeyToSwapTo = "article_id";
    const expected = [
      {
        body: "Oh, I've got compassion running out of my nose",
        article_id: 9,
        created_by: "butter_bridge",
        votes: 16,
        created_at: "2020-04-06T13:17:00.000Z",
      },
      {
        body: "The beautiful thing about treasure is that it exists.",
        article_id: 1,
        created_by: "butter_bridge",
        votes: 14,
        created_at: "2020-10-31T03:03:00.000Z",
      },
    ];
    const output = dataRelationParser(
      inputData,
      inputKVP,
      inputKeyToSwapFrom,
      inputKeyToSwapTo
    );
    expect(output).toEqual(expected);
  });
  test("Check the original data and the kvp arrays do not mutate", () => {
    const inputData = [
      {
        body: "Oh, I've got compassion running out of my nose",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: "2020-04-06T13:17:00.000Z",
      },
      {
        body: "The beautiful thing about treasure is that it exists.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: "2020-10-31T03:03:00.000Z",
      },
    ];

    const inputDataCopy = [
      {
        body: "Oh, I've got compassion running out of my nose",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: "2020-04-06T13:17:00.000Z",
      },
      {
        body: "The beautiful thing about treasure is that it exists.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: "2020-10-31T03:03:00.000Z",
      },
    ];

    const inputKVP = [
      { title: "Living in the shadow of a great man", article_id: 1 },
      { title: "Sony Vaio; or, The Laptop", article_id: 2 },
      { title: "They're not exactly dogs, are they?", article_id: 9 },
    ];
    const inputKVPCopy = [
      { title: "Living in the shadow of a great man", article_id: 1 },
      { title: "Sony Vaio; or, The Laptop", article_id: 2 },
      { title: "They're not exactly dogs, are they?", article_id: 9 },
    ];

    const inputKeyToSwapFrom = "belongs_to";
    const inputKeyToSwapTo = "article_id";
    dataRelationParser(
      inputData,
      inputKVP,
      inputKeyToSwapFrom,
      inputKeyToSwapTo
    );
    expect(inputData).toEqual(inputDataCopy);
    expect(inputKVP).toEqual(inputKVPCopy);
  });
});

// describe.only("keyNameChanger", () => {
//   test("Check an empty data array returns an empty array", () => {
//     const inputData = [];
//     const inputOrigKeyName = "title";
//     const inputReplKeyName = "article_id";
//     const expected = [];
//     const output = keyNameChanger(
//       inputData,
//       inputOrigKeyName,
//       inputReplKeyName
//     );
//     expect(output).toEqual(expected);
//   });
//   test("Check a single line data file returns the keys swapped over", () => {
//     const inputData = [];
//     const inputOrigKeyName = "title";
//     const inputReplKeyName = "article_id";
//     const expected = [];
//     const output = keyNameChanger(
//       inputData,
//       inputOrigKeyName,
//       inputReplKeyName
//     );
//     expect(output).toEqual(expected);
//   });
//   test("Check a multi line data file returns the keys swapped over", () => {
//     const inputData = [];
//     const inputOrigKeyName = "title";
//     const inputReplKeyName = "article_id";
//     const expected = [];
//     const output = keyNameChanger(
//       inputData,
//       inputOrigKeyName,
//       inputReplKeyName
//     );
//     expect(output).toEqual(expected);
//   });
//   test("Check for error if origKeyName does not exist", () => {
//     const inputData = [];
//     const inputOrigKeyName = "title";
//     const inputReplKeyName = "article_id";
//     const expected = [];
//     const output = keyNameChanger(
//       inputData,
//       inputOrigKeyName,
//       inputReplKeyName
//     );
//     expect(output).toEqual(expected);
//   });
//   test("Check for error if replKeyName does not exist", () => {
//     const inputData = [];
//     const inputOrigKeyName = "title";
//     const inputReplKeyName = "article_id";
//     const expected = [];
//     const output = keyNameChanger(
//       inputData,
//       inputOrigKeyName,
//       inputReplKeyName
//     );
//     expect(output).toEqual(expected);
//   });
//   test("Check the original array has not mutated", () => {
//     const inputData = [];
//     const expected = []; // Hard coded copy of inputData
//     const inputOrigKeyName = "title";
//     const inputReplKeyName = "article_id";
//     const output = keyNameChanger(
//       inputData,
//       inputOrigKeyName,
//       inputReplKeyName
//     );
//     expect(inputData).toEqual(expected);
//   });
// });
