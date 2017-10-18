

exports.delayResolved = function delayResolved(milliseconds, callback, value) {
  setTimeout(() => {
    callback(null, value);
  }, milliseconds);
};

exports.delayRejected = function delayRejected(milliseconds, callback) {
  setTimeout(() => {
    callback(new Error('A sample error!'));
  }, milliseconds);
};
