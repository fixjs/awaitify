const awaitify = require('./lib/awaitify');
const isGenerator = require('./lib/isGenerator');
const NativePromise = global.Promise;
let GeneratorFunction;

/* jshint ignore:start */
GeneratorFunction = Object.getPrototypeOf(function* () {}).constructor;
/* jshint ignore:end */

function isPromiseAlike(obj) {
  return obj && typeof obj === 'object' && typeof obj.then === 'function';
}

function wrap(promise) {
  return {
    done: function (onFulfilled, onRejected) {
      const self = arguments.length ? promise.then.apply(promise, arguments) : promise;
      self.then(null, function (err) {
        setTimeout(function () {
          throw err;
        }, 0);
      });
    }
  };
}

// Sorry for this I know it hurts :)
GeneratorFunction.prototype.awaitify = function () {
  return awaitify(this);
};
GeneratorFunction.prototype.exec = function () {
  return awaitify(this).apply(undefined, arguments);
};

function makeAsync(fn) {
  return isGenerator(fn) ? fn.awaitify() : fn;
}

function Promise(fn) {
  this.promise = isPromiseAlike(fn) ? fn : new NativePromise(makeAsync(fn));
}
Promise.prototype.then = function (onFulfilled, onRejected) {
  return new Promise(this.promise.then(makeAsync(onFulfilled), makeAsync(onRejected)));
};
Promise.prototype['catch'] = function (onRejected) {
  return new Promise(this.promise['catch'](makeAsync(onRejected)));
};
Promise.prototype.done = function (onFulfilled, onRejected) {
  wrap(this.promise).done(makeAsync(onFulfilled), makeAsync(onRejected));
};
Promise.all = function (obj) {
  return new Promise(NativePromise.all(obj));
};
Promise.race = function (obj) {
  return new Promise(NativePromise.race(obj));
};
Promise.resolve = function (obj) {
  return new Promise(NativePromise.resolve(obj));
};
Promise.reject = function (obj) {
  return new Promise(NativePromise.reject(obj));
};

awaitify.Promise = Promise;
awaitify.async = require('./lib/async');
awaitify.cb = require('./lib/cb');
awaitify.it = require('./lib/it');

module.exports = awaitify;
