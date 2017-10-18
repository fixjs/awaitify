const isPromiseAlike = require('./isPromiseAlike');
const NativePromise = global.Promise;

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