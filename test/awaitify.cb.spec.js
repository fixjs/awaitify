const assert = require('assert');
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const awaitify = require('../index');
const expect = chai.expect;

function delayResolved(milliseconds, callback, value) {
  setTimeout(() => {
    callback(null, value);
  }, milliseconds);
}

function delayRejected(milliseconds, callback) {
  setTimeout(() => {
    callback(new Error('A sample error!'));
  }, milliseconds);
}

describe('awaitify', () => {
  describe('#cb()', () => {
    const packageFilePath = path.join(__dirname + '/../package.json');
    let filePromise;
    let delayResolvedPromise;
    let delayRejectedPromise;
    beforeEach(() => {
      filePromise = awaitify.cb(cb => fs.readFile(packageFilePath, cb));
      delayResolvedPromise = awaitify.cb(cb => delayResolved(100, cb, 'ResolvedValue'));
      delayRejectedPromise = awaitify.cb(cb => delayRejected(100, cb));
    });

    it('should create a promise', () => {
      expect(filePromise).not.to.be.null;
      expect(filePromise).not.to.be.undefined;
      expect(filePromise.then).to.be.a('function');
    });

    it('## 1 ## should convert the callback based solution to a promise based solution', (done) => {
      filePromise
        .then((data) => {
          assert.equal(typeof data, 'object');
        })
        .then(done);
    });

    it('## 2 ## should convert the callback based solution to a promise based solution', (done) => {
      delayResolvedPromise
        .then((data) => {
          assert.equal(typeof data, 'string');
          assert.equal(data, 'ResolvedValue');
        })
        .then(done);
    });

    it('## 3 ## should convert the callback based solution to a promise based solution', (done) => {
      delayRejectedPromise
        .catch((data) => {
          assert.equal(typeof data, 'object');
          assert.equal(data.message, 'A sample error!');
          done();
        });
    });
  });
});
