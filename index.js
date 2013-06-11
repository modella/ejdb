
/**
 * get `ejdb` adapter with `EJDB` instance.
 *
 * @param {EJDB} ej
 * @return {Function}
 */

module.exports = function(ej){
  if (!ej) throw new TypeError('expected: EJDB instance');
  return function(model){
    model._sync = exports;
    model.ej = ej;
  }
};

/**
 * ejdb
 */

exports.name = 'ejdb';

/**
 * Save.
 *
 * @param {Function} fn
 */

exports.save = function(fn){
  var name = this.model.modelName
    , ej = this.model.ej
    , obj = this.toJSON()
    , self = this;

  ej.save(name, [obj], function(err, oids){
    if (err) return fn(err);
    obj.id = oids[0];
    fn(null, obj);
  });
};

/**
 * Update.
 *
 * @param {Function} fn
 */

exports.update = function(fn){
  var name = this.model.modelName
    , ej = this.model.ej
    , obj = this.toJSON()
    , self = this;

  ej.update(name, [obj], function(err){
    if (err) return fn(err);
    fn(null, obj);
  });
};

/**
 * Get all with the given `query`, `[or]`, `[hints]` and `fn`.
 *
 * @param {Object} query
 * @param {Array} or
 * @param {Object} hints
 * @param {Function} fn
 */

exports.all = function(){
  var args = [].slice.call(arguments)
    , name = this.modelName
    , ej = this.ej;

  var fn = args.pop();
  args.unshift(name);
  args.push(done);
  ej.find.apply(ej, args);
  function done(err, c){
    if (err) return fn(err);
    expand(c, fn);
  }
};

/**
 * Get a user with `query`, `[or]`, `[hints]` and `fn`.
 *
 * @param {Object} query
 * @param {Array} or
 * @param {Object} hints
 * @param {Function} fn
 */

exports.get = function(){
  var args = [].slice.call(arguments)
    , name = this.modelName
    , ej = this.ej;

  // col
  args.unshift(name);

  // id
  args[1] = 'object' != typeof args[1]
    ? { _id: args[1] }
    : args[1];

  // one
  ej.findOne.apply(ej, args);
};

/**
 * Expand the given cursor.
 *
 * @param {Cursor} c
 * @param {Function} fn
 * @return {Array}
 */

function expand(c, fn){
  setImmediate(function(){
    var all = [];
    while (c.next()) all.push(c.object());
    fn(null, all);
  });
}
