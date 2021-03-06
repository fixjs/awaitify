const awaitify = require('../index');

const SampleModuleV1 = awaitify.module({
  createSomething: function*(){
    let result = yield Promise.resolve('Something');
    result += ' V1';
    return result;
  },

  helloWorld(){
    return 'helloWorld v1';
  }
});

const SampleModuleV2 = awaitify.module(SampleModuleV1 ,{
  helloWorldV2(){
    return 'helloWorld v2';
  },

  *createSomething(){
    let result = yield SampleModuleV1.createSomething();
    result += ', V2';
    return result;
  }
});

const SampleModuleV3 = awaitify.module(SampleModuleV1, {
  *createSomething() {
    let result = yield SampleModuleV1.createSomething();
    result += ', V3';
    return result;
  }
}, true);

const SampleModuleV4 = awaitify.module({
  helloWorld(){
    return 'helloWorld v4';
  },
  *createSomething() {
    let result = yield Promise.resolve('Something');
    result += ' V4';
    return result;
  }
}, true);
/*
setTimeout(function*(){
  SampleModuleV2.helloWorld();
  const result = yield SampleModuleV2.createSomething();
  console.log('result: ', result);
}.awaitify());
*/
module.exports = {
  SampleModuleV1,
  SampleModuleV2,
  SampleModuleV3,
  SampleModuleV4
};