const _ = require('lodash');
const genCache = new Map();

module.exports = awaitify;

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