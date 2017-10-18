
module.exports = isPromiseAlike;

function isPromiseAlike(obj) {
  return obj && typeof obj === 'object' && typeof obj.then === 'function';
}