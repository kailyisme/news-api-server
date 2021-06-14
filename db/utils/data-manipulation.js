const format = require("pg-format");

exports.dbLoading = function (table_name, data) {
  const queryBeginning = `INSERT INTO ${table_name}`;
  let insertQuery = "";
  const parsedDataRows = data.map((row) => {
    let keys = Object.keys(row);
    let values = keys.map((key) => row[key]);
    let toInsertString = format(
      `${queryBeginning} (%s) VALUES (%L);\n`,
      keys,
      values
    );
    insertQuery = `${insertQuery}${toInsertString}`;
  });
  return insertQuery;
};
