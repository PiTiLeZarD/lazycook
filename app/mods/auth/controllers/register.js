var passport = require('passport')
  , db = require('../../../lib/db')
  , crypto = require('crypto');

module.exports.postregister = {
    'path': '/user/register'
  , 'method': 'post'
  , 'fn': function(req, res, next) {
      req.assert('email', 'Valid email required').isEmail();
      if (req.assertErrorsToHome()) return;

      var email = req.body.email
        , login = crypto.randomBytes(20).toString('hex');
      
      new db.User({
          'login': login
        , 'email': email
        , 'role': 'user'
      }).save(function(err) {
        if (err) return next(err);

        var user = db.User.findOne({'login':login, 'email': email}, function(err, user) {
          if (err) return next(err);

          user.sendRegisterEmail(function(err) {

            if (err) {

              user.remove(function(rerr) {
                if (rerr) return next(rerr);
                return next(err);
              });

            } else {

              req.flash('register_email', email);
              res.redirect('/user/register');
            }

          });

        });
      });

    }
}

module.exports.register = {
    'path': '/user/register'
  , 'fn': function(req, res, next) {
      var email = req.flash('register_email');
      if (!email || !email.length) return res.redirect('/');

      res.render('register', {'email': email});
    }
}

module.exports.confirm = {
    'path': '/user/confirm/:hash'
  , 'fn': function(req, res, next) {
      req.assert('hash', 'Valid hash required').len(20).isHexadecimal();
      if (req.assertErrorsToHome()) return;

      var hash = req.params.hash;

      db.User.findOne({'login': hash}, function(err, user) {
        if (err) next(err);

        res.render('confirm', {'hash': hash}); 
      });
    }
}

module.exports.postconfirm = {
    'path': '/user/confirm/:hash'
  , 'method': 'post'
  , 'fn': function(req, res, next) {
      req.assert('hash', 'Valid hash required').len(20).isHexadecimal();
      if (req.assertErrorsToHome()) return;

      var hash = req.params.hash
        , login = req.body.login
        , password = req.body.password
        , password_confirm = req.body.password_confirm;

      req.assert('login', 'Login required').notEmpty();
      req.assert('password', 'Password too weak').len(6, 100);
      req.assert('password_confirm', 'Mismatch in paswords').equals(password);

      var errors = req.validationErrors();
      if (errors && errors.length) {
        var messages = null;
        errors.forEach(function(val) {
          (messages = messages || []).push(val['msg']);
        });
        req.flash('messages', messages);
        return res.redirect('/user/confirm/' + hash);
      }

      db.User.findOne({'login': login}, function(err, user) {
        if (err) return next(err);
        if (user) {
          req.flash('messages', ['Login is already in use']);
          return res.redirect('/user/confirm/' + hash);
        }

        db.User.findOne({'login': hash}, function(err, user) {
          if (err) return next(err);

          user.login = login;
          user.password = password;
          user.save(function(err) {
            if (err) next(err);

            req.login(user, function(err) {
              if (err) next(err);

              return res.redirect('/user/welcome');
            });
          });

        });
      }); 

    }
}

module.exports.welcome = {
    'path': '/user/welcome'
  , 'fn': function(req, res, next) {
      res.render('welcome');
    }
}
