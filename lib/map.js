require('./awaitify');
const _ = require('lodash');
const isGenerator = require('./isGenerator');

module.exports = function map(array, fn) {
  let mapIterator = fn;
  if(isGenerator(fn)){
    mapIterator = fn.awaitify();
  }
  return Promise.all(_.map(array, mapIterator));
};