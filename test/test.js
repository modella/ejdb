
var exec = require('child_process').exec
  , model = require('modella')
  , ejdb = require('..')
  , db = require('ejdb')
  , User
  , user
  , ej;

describe('modella ejdb', function(){

  before(function(){
    ej = db.open(__dirname + '/test.db');
  })

  before(function(){
    User = model('User');
    User.use(ejdb(ej));
    User.attr('name');
    User.attr('nick');
    User.attr('_id');
  })

  describe('save', function(){
    it('should save obj', function(done){
      user = new User();
      user.name('foo');
      user.nick('baz');
      user.save(done);
    })
  })

  describe('update', function(){
    it('should update the obj', function(done){
      user.nick('baz');
      user.name('foo');
      user.save(done);
    })
  })

  describe('get', function(){
    it('should work with the oid as a string', function(done){
      User.get(user.primary(), function(err, obj){
        if (err) return done(err);
        obj.name().should.equal(user.name());
        user.name().should.equal('foo');
        done();
      })
    })

    it('should work with queries', function(done){
      User.get({ name: 'foo' }, function(err, obj){
        if (err) return done(err);
        obj.nick().should.equal('baz');
        done();
      })
    })
  })

  describe('all', function(){
    it('should get all objs', function(done){
      User.all(done);
    })

    it('should work with queries', function(done){
      User.all({ nick: 'baz' }, function(err, all){
        if (err) return done(err);
        all[0].name().should.equal('foo');
        done();
      })
    })
  })

  after(function(done){
    ej.close();
    exec('rm -rf ' + __dirname + '/test.db*', done);
  })

})
