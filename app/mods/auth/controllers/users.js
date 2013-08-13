var db = require('../../../lib/db');

module.exports.users = {
    'path': '/users'
  , 'fn': function(req, res) {
      res.render('users');
    }
};

module.exports.list_json = {
    'path': '/users/list.json'
  , 'fn': function(req, res) {
      db.User.find(function(err, users) {
        if (err) console.log(err);
        res.json(users);
      });
    }
};
