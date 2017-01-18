var assert = require('assert');
var fs = require('fs');
var path = require('path');
var chai = require('chai');
var awaitify = require('../index');
var expect = chai.expect;

describe('awaitify', () => {
  describe('#()', () => {
    var fn;
    beforeEach(() => {
      fn = awaitify(function* () {
        var value = yield Promise.resolve('Sample Data');
        return value;
      });
    });

    it('should create a function', () => {
      expect(fn).to.be.a('function');
    });

    it('should convert yield keword in a function generator to a promise chain', (done) => {
      fn()
        .then((value) => {
          assert.equal(value, 'Sample Data');
        })
        .then(done);
    });
  });
});
