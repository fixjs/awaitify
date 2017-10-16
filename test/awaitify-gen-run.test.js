const run = require('gen-run');
const awaitify = require('../index');

let functions = {
  get: function (key) {
    return function (callback) {
      setTimeout(() => {
        callback(null, 'gen-run::' + key);
      }, 100);
    };
  },
  incrementErrorCountAndCheckForThreshold: function (key) {
    return function (callback) {
      run(function*() {
        let data = yield functions.get(key);
        callback(null, data);
      });
    };
  },
  send: awaitify(function *(key) {
    const data = yield functions.incrementErrorCountAndCheckForThreshold(key);
    if(data === ('gen-run::' + key)){
      return data + '::incremented';
    }
    throw Error('INVALID DATA');
  }),

  main: awaitify(function * () {
    try {
      const result = yield functions.send('Mehran');
      const result2 = yield functions.get('ANOTHER_KEY');
      const result3 = yield functions.get('ANOTHER_KEY_2');
      console.log('>>>>> 1:', result);
      console.log('>>>>> 2:', result2);
      console.log('>>>>> 3:', result3);
      return {
        result,
        result2,
        result3,
      };
    } catch (err){
      return err;
    }
  }),
};

// functions
//   .main()
//   .then((result) => {
//      console.log('Final Result: ', result);
//   });

module.exports = functions;