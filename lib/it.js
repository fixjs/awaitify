const awaitify = require('./awaitify');
const isGenerator = require('./isGenerator');

module.exports = it;

function it(originalIt) {
  return function (title, fn) {
    if(!isGenerator(fn)){
      return originalIt.apply(this, arguments);
    }
    originalIt(title, function (done) {
      awaitify(fn)().then(() => {
        done();
      });
    });
  }
}