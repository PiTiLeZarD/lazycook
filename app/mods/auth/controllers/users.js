var db = require('../../../lib/db');

module.exports.users = {
    'path': '/users'
  , 'groups': ['admin']
  , 'fn': function(req, res) {
      res.render('users', {'ngApp': 'ng-users'});
    }
};

module.exports.list_json = {
    'path': '/users/list.json'
  , 'groups': ['admin']
  , 'fn': function(req, res) {
      db.User.find(function(err, users) {
        if (err) console.log(err);
        res.json(users);
      });
    }
};
