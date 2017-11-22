require('./lib/core');
const awaitify = require('./lib/awaitify');

awaitify.Promise = require('./lib/promise');
awaitify.cb = require('./lib/cb');
awaitify.map = require('./lib/map');
awaitify.parallel = require('./lib/parallel');
awaitify.module = require('./lib/module');
awaitify.it = require('./lib/it');
awaitify.isGenerator = require('./lib/isGenerator');
awaitify.fs = require('./lib/fs');

module.exports = awaitify;
