const assert = require('assert');
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const awaitify = require('../index');
const expect = chai.expect;

describe('awaitify', () => {
  describe('#()', () => {
    let fn;
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
