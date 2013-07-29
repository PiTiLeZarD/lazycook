var passport = require('passport');

exports.postlogin = {
    'path': '/login'
  , 'method': 'post'
  , 'fn': function(req, res) {

    passport.authenticate('local', { 
        successRedirect: '/'
      , failureRedirect: '/login'
      , failureFlash: true 
    });

  }
};

exports.login = {
    'path': '/login'
  , 'fn': function(req, res) {
      res.render('login');
  }
};

