## ejdb

[ejdb](http://ejdb.org) plugin for [modella](http://github.com/modella).

## Installation

    npm install modella-ejdb

## Example

```js
var model = require('modella')
  , ejdb = require('modella-ejdb')
  , db = require('ejdb');

var ej = db.open('foo.db');
var User = model('User');
User.use(ejdb(ej));

User.attr('_id');
User.attr('name');
User.attr('nick');

new User()
.name('amir')
.nick('yields')
.save(function(err){
  console.log(user.primary());
});
```

## tests

    $ make test

## todo

  - `.removeAll`
  - `.remove`

# License

MIT
