const chai = require('chai');
const awaitify = require('../index');
const expect = chai.expect;
const delayResolved = require('./sample-asyns').delayResolved;

describe('awaitify', () => {
  describe('#parallel()', () => {
    let result;

    function * sampleAsyncCall() {
      result = awaitify.parallel({
        first: function *() {
          const value = yield awaitify.cb(cb => delayResolved(100, cb, 'FirstResolvedValue'));
          console.log(`"first" gets resolved to ${value}`);
          return value;
        },
        second: awaitify.cb(cb => delayResolved(100, cb, 'SecondResolvedValue')),
      });
    }

    beforeEach(function(done) {
      sampleAsyncCall
        .exec()
        .then(() => {
          done();
        });
    });

    it('should create a promise', () => {
      expect(result.then).to.be.a('function');
    });

    it('should convert a yield based parallel scenario into one object', (done) => {
      result
        .then((finalResult) => {
          expect(finalResult).to.be.an('object');
          expect(finalResult.first).to.equal('FirstResolvedValue');
          expect(finalResult.second).to.equal('SecondResolvedValue');
          done();
        });
    });
  });
});
