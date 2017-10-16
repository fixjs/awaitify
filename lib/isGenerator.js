module.exports = function isGenerator(fn) {
  if(typeof fn === 'function') {
    return /^function\s*\*/.test(fn.toString());
  }
  return false;
};