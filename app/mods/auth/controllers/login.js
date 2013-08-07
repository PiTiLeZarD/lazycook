var passport = require('passport')
  , db = require('../../../lib/db');


module.exports.postlogin = {
    'path': '/login'
  , 'method': 'post'
  , 'fn': function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);

        if (!user) {
          req.flash('messages', [info.message]);
          return res.redirect('/login');
        }

        req.login(user, function(err) {
          if (err) next(err);
          return res.redirect('/');
        });
      })(req, res, next);
    }
};

module.exports.login = {
    'path': '/login'
  , 'fn': function(req, res) {
      res.render('login');
    }
};

module.exports.logout = {
    'path': '/logout'
  , 'fn': function(req, res) {
      req.logout();
      res.redirect('/');
    }
};
