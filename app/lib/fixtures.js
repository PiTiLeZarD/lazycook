
var db = require('./db');


module.exports.clearDB = function(done) {
  db.mongo.collections(function(err, collections){
    if (err) return done(err);

    var todo = collections.length;
    if (!todo) return done();

    collections.forEach(function(collection){
      if (collection.collectionName.match(/^system\./)) return --todo;

      collection.remove({},{safe: true}, function() {
        if (--todo === 0) done();
      });
    });
  });
};

module.exports.User = function(next) {

  new db.User({
      'login'   : 'admin'
    , 'password': 'admin'
    , 'email'   : 'admin-lazycook@mailinator.com'
    , 'role'    : 'admin'
  }).save(function(err) {
    if (err) console.log('Error while saving admin', err);

    var nb_done = 0
      , users = ['user1', 'user2', 'user3', 'user4'];

    users.forEach( function( username ) {
      new db.User({
          'login'   : username
        , 'password': username
        , 'email'   : username + '-lazycook@mailinator.com'
        , 'role'    : 'user'
      }).save(function(err) {
        if (err) {
          console.log('Error while saving user', err);
          next(err);
        }

        nb_done += 1;
        if (nb_done == users.length) next(null);
      });
    });
  });
  
};
