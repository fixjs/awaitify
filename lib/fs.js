require('./core');
const fs = require('fs');
const cb = require('./cb');

function readFile(path, encoding = 'utf8') {
  return cb(callback => fs.readFile(path, encoding, callback));
}

function * readConfigFile(configFilePath) {
  const data = yield readFile(configFilePath, 'utf8');
  return JSON.parse(data);
}

module.exports = {
  readFile,
  readConfigFile: readConfigFile.awaitify(),
};