const _ = require('lodash');
const cb = require('./cb');

module.exports = (fn, context) => {
  return function(){
    const args = _.slice(arguments);
    return cb((cb) => {
      args.push(cb);
      return fn.apply(context, args);
    });
  };
};
