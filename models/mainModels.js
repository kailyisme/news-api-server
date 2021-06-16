const dbConn = require("../db/connection");

exports.selectAllTopics = async function () {
  const result = await dbConn.query("SELECT * FROM topics;");
  return result.rows;
};
