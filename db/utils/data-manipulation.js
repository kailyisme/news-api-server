const format = require("pg-format");

exports.dbLoading = function (table_name, data, flagToReturn = false) {
  const queryBeginning = `INSERT INTO ${table_name}`;
  let insertQuery = "";
  const parsedDataRows = data.map((row) => {
    let keys = Object.keys(row);
    let values = keys.map((key) => row[key]);
    let toInsertString = format(
      `${queryBeginning} (%s) VALUES (%L)`,
      keys,
      values
    );
    if (flagToReturn) {
      toInsertString += " RETURNING *;\n";
    } else {
      toInsertString += ";\n";
    }
    insertQuery = `${insertQuery}${toInsertString}`;
  });
  return insertQuery;
};

exports.kvpCreator = function (data, key_name, value_name) {
  return data.map((entry) => {
    const tempObj = {};
    tempObj[key_name] = entry.rows[0][key_name];
    tempObj[value_name] = entry.rows[0][value_name];
    return tempObj;
  });
};

exports.dataRelationParser = function (data, kvp, keyToSwap, swapTo) {
  const keyToLookFor = Object.keys(kvp[0]).find((key) => key !== swapTo);
  return data.map((entry) => {
    const tempObj = {};
    Object.keys(entry).forEach((key) => {
      if (key === keyToSwap) {
        let kvpRow = kvp.find(
          (kvpPair) => entry[keyToSwap] === kvpPair[keyToLookFor]
        );
        tempObj[swapTo] = kvpRow[swapTo];
      } else {
        tempObj[key] = entry[key];
      }
    });
    return tempObj;
  });
};

exports.keyNameChanger = function (data, origKeyName, replKeyName) {
  return data.map((entry) => {
    const entryKeys = Object.keys(entry);
    let tempObj = {};
    entryKeys.map((key) => {
      if (key === origKeyName) {
        tempObj[replKeyName] = entry[key];
      } else {
        tempObj[key] = entry[key];
      }
    });
    return tempObj;
  });
};
