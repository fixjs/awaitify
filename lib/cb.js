const _ = require('lodash');

module.exports = fn => (!_.isFunction(fn) ?
    (Promise.reject(Error('Invalid callback function'))) :
    (new Promise((resolve, reject) => fn((err, data) => {
      if (err) {
        console.error(err, _.get(err, 'stack'));
        return reject(err);
      }
      resolve(data);
    }))));
