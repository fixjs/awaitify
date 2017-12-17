const _ = require('lodash');
require('./core');
const isGenerator = require('./isGenerator');
const defaultBaseModule = {};

module.exports = function (baseModule, moduleDefinition, doNotWrapInGenRunCallback) {
  if (arguments.length === 1 || moduleDefinition === undefined) {
    moduleDefinition = baseModule;
    baseModule = defaultBaseModule;
  }
  const moduleObject = Object.create(baseModule);
  _(moduleDefinition)
    .keys()
    .each((attributeKey) => {
      const value = moduleDefinition[attributeKey];
      moduleObject[attributeKey] = isGenerator(value) ? doNotWrapInGenRunCallback ? value.awaitify(): wrapInGenRunCallback(value.awaitify()) : value;
      if(_.isFunction(value)) {
        moduleDefinition[attributeKey] = _(value.toString()).words().includes('this') ? function () {
          return apply(moduleObject[attributeKey], moduleObject, arguments);
        }: moduleObject[attributeKey];
      }
    });
  return moduleObject;
};

function wrapInGenRunCallback(awaitifyFunc) {
  return function () {
    const args = _.slice(arguments);
    return (callback) => {
      return awaitifyFunc.apply(undefined, args)
        .then(result => callback(null, result))
        .catch(callback);
    };
  };
}

/**
 * BORROWED FROM lodash:
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}