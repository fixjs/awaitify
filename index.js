require('./lib/core');
const awaitify = require('./lib/awaitify');

awaitify.Promise = Promise;
awaitify.cb = require('./lib/cb');
awaitify.map = require('./lib/map');
awaitify.parallel = require('./lib/parallel');
awaitify.it = require('./lib/it');
awaitify.fs = require('./lib/fs');

module.exports = awaitify;
