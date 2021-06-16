const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const dbConn = require('../connection.js');

const runSeed = () => {
  return seed(devData).then(() => dbConn.end());
};

runSeed();
