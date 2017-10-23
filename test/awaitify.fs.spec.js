const assert = require('assert');
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const awaitify = require('../index');
const expect = chai.expect;

describe('awaitify', () => {
  describe('#fs', () => {
    describe('#readFie', () => {
      it('should be a function', () => {
        expect(awaitify.fs).to.be.an('object');
        expect(awaitify.fs.readFile).to.be.a('function');
      });

      it('should read a file and return a promise.', (done) => {
        const filePath = path.join(__dirname + '/../package.json');
        awaitify.fs.readFile(filePath)
          .then((result)=>{
            expect(result).to.be.a('string');
            done();
          });
      });
    });

    // describe('#readConfigFile', () => {
    //   it('should be a function', () => {
    //     expect(awaitify.fs).to.be.an('object');
    //     expect(awaitify.fs.readConfigFile).to.be.a('function');
    //   });
    //
    //   it('should read a file and return a promise.', (done) => {
    //     const filePath = path.join(__dirname + '/../package.json');
    //     awaitify.fs.readConfigFile(filePath)
    //       .then((result)=>{
    //         assert.equal(typeof result, 'object');
    //         assert.equal(result.name, 'awaitify');
    //         done();
    //       });
    //   });
    // });
  });
});
