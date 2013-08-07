
var db = require('../../../lib/db');


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
