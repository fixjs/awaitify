var _ = require('lodash');

module.exports = (fn) => {
  if(!_.isFunction(fn)) {
    return Promise.reject(Error('Invalid callback function'));
  }
  return new Promise((resolve, reject) => {
    var callback = (err, data) => {
      if(err) {
        console.error(err, err.stack);
        return reject(err);
      }
      resolve(data);
    };
    fn(callback);
  });
};
