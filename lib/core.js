const awaitify = require('./awaitify');
let GeneratorFunction;

/* jshint ignore:start */
GeneratorFunction = Object.getPrototypeOf(function* () {}).constructor;
/* jshint ignore:end */

// Sorry for this I know it hurts :)
GeneratorFunction.prototype.awaitify = function () {
  return awaitify(this);
};
GeneratorFunction.prototype.exec = function () {
  return awaitify(this).apply(undefined, arguments);
};