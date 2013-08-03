var passport = require('passport')
  , db = require('../../lib/db');


exports.postlogin = {
    'path': '/login'
  , 'method': 'post'
  , 'fn': function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);

        if (!user) {
          req.session.messages =  [info.message];
          return res.redirect('/login')
        }

        req.login(user, function(err) {
          if (err) return next(err);
          req.session.messages = [];
          return res.redirect('/');
        });
      })(req, res, next);
    }
};

exports.login = {
    'path': '/login'
  , 'fn': function(req, res) {
      res.render('login', {'revealId': 'login'});
    }
};

exports.logout = {
    'path': '/logout'
  , 'fn': function(req, res) {
      req.logout();
      res.redirect('/');
    }
};
