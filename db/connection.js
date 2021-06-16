const { Pool } = require("pg");
const path = require("path");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set");
}
const dbConn = new Pool();

module.exports = dbConn;
