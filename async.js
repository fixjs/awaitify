var _ = require('lodash');
var cb = require('./cb');

module.exports = (fn, context) => {
  return() => {
    var args = _.slice(arguments);
    return cb((cb) => {
      args.push(cb);
      return fn.apply(context, args);
    });
  };
};
