const _ = require('lodash');
require('./core');
const isGenerator = require('./isGenerator');
const defaultBaseModule = {};

module.exports = function (baseModule, moduleDefinition) {
  if (arguments.length === 1) {
    moduleDefinition = baseModule;
    baseModule = defaultBaseModule;
  }
  const moduleObject = Object.create(baseModule);
  _(moduleDefinition)
    .keys()
    .each((attributeKey) => {
      const value = moduleDefinition[attributeKey];
      moduleObject[attributeKey] = isGenerator(value) ? wrapInGenRunCallback(value.awaitify()) : value;
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