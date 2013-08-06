
var db = require('../../lib/db')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , login = require('./login')
  , register = require('./register');


/* our two sub controllers */
[login, register].forEach(function(ctrl) {
  for (exp in ctrl) {
    exports[exp] = ctrl[exp];
  }
});

exports.middlewares = function( app, options ) {
  var verbose = options.verbose;

  /* passport authentication */
  passport.use(new LocalStrategy(
    {
        'usernameField': 'login'
      , 'passwordField': 'password'
    }
    , function(login, password, next) {
      db.User.findOne({ login: login }, function(err, user) {
        if (err) return next(err);

        if (!user) {
          return next(null, false, { message: 'Incorrect login.' });
        }

        user.comparePassword(password, function(err, isMatch) {
          if (err) next(err, false);
          if (isMatch) {
            verbose && console.log('User %s logged in', login);
            next(null, user);
          }
          else next(null, false, { message: 'Incorrect password.' });
        });

      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.login);
  });
  passport.deserializeUser(function(login, done) {
    db.User.find({'login': login}, done);
  });

  app.use(passport.initialize());
  app.use(passport.session());

  /* our dynamic helper */
  app.use(function(req, res, next) {
    res.locals.user = req.isAuthenticated() ? req.user[0] : false;

    next();
  });
}