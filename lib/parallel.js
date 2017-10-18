require('./core');
const _ = require('lodash');
const map = require('./map');
const isGenerator = require('./isGenerator');

module.exports = parallel.awaitify();

function* parallel(options) {
  const list = yield map(_.keys(options), function* (key) {
    const optionValue = options[key];
    let value;
    if(isGenerator(optionValue)){
      value = yield optionValue.exec();
    } else {
      value = yield optionValue;
    }
    return {
      [key]: value,
    };
  });
  return _.merge.apply(_, list);
}