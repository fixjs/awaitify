const chai = require('chai');
const awaitify = require('../index');
const expect = chai.expect;
const it = awaitify.it(global.it);
const { SampleModuleV1, SampleModuleV2 } = require('./module-samples');

const sampleModule = {
  *doSomething(){
    let result = yield Promise.resolve('did something');
    result += '!';
    return result;
  }
};

describe('awaitify', () => {
  describe('#module()', () => {expect(SampleModuleV2.helloWorld()).to.equal('helloWorld v1');
    let resultV1;
    let resultV2;

    function * sampleModules() {
      resultV1 = SampleModuleV1.createSomething();
      resultV2 = SampleModuleV2.createSomething();
    }

    beforeEach(function(done) {
      sampleModules
        .exec()
        .then(() => {
          done();
        });
    });

    it('an async function should return a gen-run callback', () => {
      expect(resultV1).to.be.a('function');
      expect(resultV2).to.be.a('function');
    });

    it('should automatically convert a generator function to an async function #1', function* () {
      const result = yield resultV1;
      expect(result).to.be.a('string');
      expect(result).to.equal('Something V1');
    });

    it('should automatically convert a generator function to an async function #2', function* () {
      const result = yield resultV2;
      expect(result).to.be.a('string');
      expect(result).to.equal('Something V1, V2');
    });

    it('should be able to inherit values and methods from a base module', () => {
      expect(SampleModuleV1.helloWorld()).to.equal('helloWorld v1');
      expect(SampleModuleV2.helloWorld()).to.equal('helloWorld v1');
      expect(SampleModuleV2.helloWorldV2()).to.equal('helloWorld v2');
    });

    it('should override the actual function with a transformed function', function* () {
      expect(awaitify.isGenerator(sampleModule.doSomething)).to.be.true;
      awaitify.module(sampleModule);
      expect(awaitify.isGenerator(sampleModule.doSomething)).to.be.false;
      const result = yield sampleModule.doSomething();
      expect(result).to.equal('did something!');
    });
  });
});
