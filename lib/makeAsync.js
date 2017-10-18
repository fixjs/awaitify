require('./core');
const isGenerator = require('./isGenerator');

module.exports = makeAsync;

function makeAsync(fn) {
  return isGenerator(fn) ? fn.awaitify() : fn;
}