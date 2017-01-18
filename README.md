# awaitify
[![Code Climate](https://codeclimate.com/github/fixjs/awaitify/badges/gpa.svg)](https://codeclimate.com/github/fixjs/awaitify)
[![Download stats](https://img.shields.io/npm/dm/awaitify.svg)](https://www.npmjs.com/package/awaitify)
A simple wrapper for function generators. You could wrap the function generator inside this function like:

```javascript
var awaitify = require('awaitify');

awaitify(function*(){
  // a xhr request to load users list
  var users = yield jQuery.get('/api/users');
  console.log(users);
}).then(function *(){
  var user = yield jQuery.get('/api/users/5698d6a5246af3c847be3000');
  console.log(user);
})
```

which allows you await on a promise using `yield` keyword also allows the pass generator functions to a promise chain.

# awaitify.cb

```javascript
var awaitify = require('awaitify');
var fs = require('fs');
awaitify.cb(function(cb){
  return fs.readFile('/any/file/path', 'utf8', cb);
})
.then((data)=>{
  console.log(data);
})
.catch((err) => {
  console.log(err, err.stack);
})
```

# awaitify.async

```javascript
var awaitify = require('awaitify');
var fs = require('fs');
var _fs={
  readFile: awaitify.async(fs.readFile, fs)
};
_fs.readFile('/any/file/path', 'utf8')
  .then((data)=>{
    console.log(data);
  })
  .catch((err) => {
    console.log(err, err.stack);
  });
```
