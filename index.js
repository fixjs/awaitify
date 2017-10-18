require('./lib/core');
const awaitify = require('./lib/awaitify');

awaitify.Promise = Promise;
awaitify.async = require('./lib/async');
awaitify.cb = require('./lib/cb');
awaitify.map = require('./lib/map');
awaitify.parallel = require('./lib/parallel');
awaitify.it = require('./lib/it');

module.exports = awaitify;
