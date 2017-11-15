const generatorTag = '[object GeneratorFunction]';
const objToString = Object.prototype.toString;

module.exports = function isGenerator(fn) {
  if(typeof fn === 'function') {
    return objToString.call(fn) === generatorTag;
  }
  return false;
};