# awaitify v1.0.3
[ ![Codeship Status for fixjs/awaitify](https://app.codeship.com/projects/1618ee20-bfdc-0134-54f6-02461f4386cc/status?branch=master)](https://app.codeship.com/projects/196778)
[![Code Climate](https://codeclimate.com/github/fixjs/awaitify/badges/gpa.svg)](https://codeclimate.com/github/fixjs/awaitify)
[![Download stats](https://img.shields.io/npm/dm/awaitify.svg)](https://www.npmjs.com/package/awaitify)


A lightweight library to simplify asynchronous operations using function generators and `yield` keyword, which is an alternative for `Async/Await` keywords without having to use any Transpiler like babel. You could wrap the function generator inside this function like this:

```javascript
var awaitify = require('awaitify');

var getUsers = awaitify(function*(){
  // a xhr request to load users list
  var users = yield jQuery.get('/api/users');
  return users;
});

getUsers()
  .then((users)=>{
    console.log(users);
  });

// or

var users = yield getUsers();
console.log(users);
```

which allows you await on a promise using `yield` keyword.

# awaitify.map([], function* (){})
```javascript
const mapList = function* (){
  const mappedUsersInfoList = awaitify.map(usersList, function* (userObject){
    const userInfo = yield loadUserInfo(userObject._id);
    userInfo.baseData = userObject;
    return userInfo;
  });
  // You can have access to the new list of usersInfo
}.awaitify();
```

# awaitify.parallel({})
```javascript
const loadData = function* (){
  const { users, config } = awaitify.parallel({
    users: function* () {
      const users = yield getUsers();
      console.log(users);
      return users;
    },
    config: awaitify.fs.loadConfigFile('./package.json')
  });
  // You can have access to both users and config variable here
}.awaitify();
```

# promise.then(function*(){})
This library also allows the pass generator functions to the promise chain implemented by this module:

```javascript
getUsers()
  .then(function *(users){
    console.log(users);
    var user = yield jQuery.get('/api/users/5698d6a5246af3c847be3000');
    console.log(user);
  });
```

# awaitify.cb

```javascript
var awaitify = require('awaitify');
var fs = require('fs');
var readFile = path => awaitify.cb(cb => fs.readFile(path, 'utf8', cb)));

var main = awaitify(function*(){
  var data;
  try{
    data = yield readFile('/any/file/path');
  } catch (err) {
    console.log(err, err.stack);
  }
  return data;
});

main();

// or

readFile('/any/file/path')
  .then(data => console.log(data))
  .catch(err => console.log(err, err.stack))
```
