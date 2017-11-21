const _ = require('lodash');
const genCache = new Map();

module.exports = awaitify;

function getHandle(generator, callback) {
  return function handle(result) {
    let promise;
    const val = result.value;
    if (result.done) {// result => { done: [Boolean], value: [Object] }
      if (_.isFunction(callback)) {
        safeCall(callback, [null, val]);
      }
      return Promise.resolve(val);
    }
    if (_.isFunction(val)) {
      promise = new Promise((resolve, reject) => {
        val((err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
    } else {
      promise = Promise.resolve(val);
    }
    return promise
      .then(res => handle(generator.next(res)))
      .catch(err => handle(generator.throw(err)));
  };
}

// this function has originally been implemented by Forbes Lindesay
// you could find the original implementation in this link https://www.promisejs.org/generators/
function async(makeGenerator, callback) {
  return function() {
    const generator = makeGenerator.apply(this, arguments);
    const handle = getHandle(generator, callback);
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