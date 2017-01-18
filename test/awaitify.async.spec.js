
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var chai = require('chai');
var awaitify = require('../index');
var expect = chai.expect;

describe('awaitify', () => {
  describe('#async()', () => {
    var readFile;
    beforeEach(function() {
      readFile = awaitify.async(fs.readFile, fs);
    });

    it('should create a function', () => {
      expect(readFile).to.be.a('function');
    });

    it('should convert a callback based function to a promise based function', (done) => {
      var filePath = path.join(__dirname + '/../package.json');
      readFile(path.join(__dirname + '/../package.json'))
        .then((data)=>{
          assert.equal(typeof data, 'object');
          done();
        });
    });
  });
});
