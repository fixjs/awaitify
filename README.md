# awaitify
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
