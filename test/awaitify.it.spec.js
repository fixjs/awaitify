const assert = require('assert');
const chai = require('chai');
const mocha = require('mocha');
const awaitify = require('../index');
const expect = chai.expect;
const it = awaitify.it(mocha.it);
const functions = require('./awaitify.test');

describe('awaitify.it', () => {
  describe('#()', () => {

    it('should work the same as original it function for promises', function *() {

      const value = yield Promise.resolve('TestResultValue');

      expect(value).to.be.a('string');

      expect(value).to.equal('TestResultValue');
    });

    it('should work with gen-run async calls', function *() {

      const obj = yield functions.main();

      expect(obj).to.be.an('object');
      expect(obj.result).to.be.a('string');
      expect(obj.result2).to.be.a('string');
      expect(obj.result3).to.be.a('string');

      expect(obj.result).to.equal('gen-run::Mehran::incremented');
      expect(obj.result2).to.equal('gen-run::ANOTHER_KEY');
      expect(obj.result3).to.equal('gen-run::ANOTHER_KEY_2');
    });
  });
});
