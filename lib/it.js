const awaitify = require('./awaitify');
const isGenerator = require('./isGenerator');

module.exports = it;

function it(originalIt) {
  return function (title, fn) {
    if(!isGenerator(fn)){
      return originalIt.apply(this, arguments);
    }
    originalIt(title, function (_done) {
      let doneIsCalled = false;
      function done() {
        if(!doneIsCalled){
          doneIsCalled = true;
          _done.apply(undefined, arguments);
        }
      }
      awaitify(fn)(done).then(done).catch(done);
    });
  }
}