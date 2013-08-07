
var db = require('../../lib/db')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , login = require('./login')
  , register = require('./register')
  , DynamicMenu = require('../../lib/dynamicMenu').DynamicMenu;


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
    res.addMenuLink('Users list', '/users');

    /* be sure to call next when we're ready */
    var step = 0;
    var nextStep = function() {
      step += 1;
      if (step == 2) next();
    }

    /* render our register menu */
    app.render('menuRegister', {'_locals': res.locals}, function(err, html) {
      if (err) {
        console.log(err);
        nextStep();
        return;
      }
  
      var registerMenu = new DynamicMenu('registerMenu');
      registerMenu.html = html; 
      res.locals.dynamicMenu.unshift(registerMenu);

      nextStep();
    });

    /* render our login menu */
    app.render('menuLoginButton', {'_locals': res.locals}, function(err, html) {
      if (err) {
        console.log(err);
        nextStep();
        return;
      }
  
      var loginMenu = new DynamicMenu('loginButton');
      loginMenu.html = html; 
      res.locals.dynamicMenu.push(loginMenu);

      nextStep();
    });

  });
}