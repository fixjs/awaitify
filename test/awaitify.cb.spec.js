var assert = require('assert');
var fs = require('fs');
var path = require('path');
var chai = require('chai');
var awaitify = require('../index');
var expect = chai.expect;

describe('awaitify', () => {
  describe('#cb()', () => {
    var packageFilePath = path.join(__dirname + '/../package.json');
    var filePromise;
    beforeEach(() => {
      filePromise = awaitify.cb(cb => {
        fs.readFile(packageFilePath, cb);
      });
    });

    it('should create a promise', () => {
      expect(filePromise).not.to.be.null;
      expect(filePromise).not.to.be.undefined;
      expect(filePromise.then).to.be.a('function');
    });

    it('should convert the callback based solution to a promise based solution', (done) => {
      filePromise
        .then((data) => {
          assert.equal(typeof data, 'object');
        })
        .then(done);
    });
  });
});
