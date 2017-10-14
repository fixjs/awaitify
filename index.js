const _ = require('lodash');
const NativePromise = global.Promise;
const genCache = new Map();
let GeneratorFunction;

/* jshint ignore:start */
GeneratorFunction = Object.getPrototypeOf(function* () {}).constructor;
/* jshint ignore:end */

function isPromiseAlike(obj) {
  return obj && typeof obj === 'object' && typeof obj.then === 'function';
}

function isGenerator(fn) {
  if(typeof fn === 'function') {
    return /^function\s*\*/.test(fn.toString());
  }
  return false;
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

// this function has originally been implemented by Forbes Lindesay
// you could find the original implementation in this link https://www.promisejs.org/generators/
function async(makeGenerator, callback) {
  return function() {
    const generator = makeGenerator.apply(this, arguments);

    function handle(result) {
      const val = result.value;

      // result => { done: [Boolean], value: [Object] }
      if(result.done) {
        if(_.isFunction(callback)){
          safeCall(callback, [null, val]);
        }
        return Promise.resolve(val);
      }

      let promise;
      if(typeof val === 'function'){
        promise = new Promise((resolve, reject) => {
          val(function (err, res) {
            if(err){
              return reject(err);
            }
            resolve(res);
          });
        });
      } else {
        promise = Promise.resolve(val);
      }

      return promise
        .then(function (res) {
          return handle(generator.next(res));
        })
        .catch(function (err) {
          return handle(generator.throw(err));
        });
    }

    try {
      return handle(generator.next());
    } catch(err) {
      return Promise.reject(err);
    }
  };
}

function safeCall(cb, args) {
  try{
    if(_.isArguments(args) || _.isArrayLike(args)){
      return cb.apply(undefined, args);
    }
    return cb.call(undefined);
  } catch (err){
    console.log('Error when calling callback function: ', cb);
  }
}

function awaitify(makeGenerator, callback) {
  let asyncGenerator;
  if(!_.isFunction(callback) && genCache.has(makeGenerator)) {
    return genCache.get(makeGenerator);
  }
  asyncGenerator = async(makeGenerator, callback);
  if(!_.isFunction(callback)) {
    genCache.set(makeGenerator, asyncGenerator);
  }
  return asyncGenerator;
}

// Sorry for this I know it hurts :)
GeneratorFunction.prototype.awaitify = function () {
  return awaitify(this);
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
awaitify.async = require('./async');
awaitify.cb = require('./cb');

module.exports = awaitify;
