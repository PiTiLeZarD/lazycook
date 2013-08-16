"use strict";

var db = require('../../../lib/db')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , DynamicMenu = require('../../../lib/dynamicMenu').DynamicMenu
  , express = require('express')
  , middleware = express()
  , acl = require('simple-acl')
  , AclStore = require('./acl-store');

module.exports = middleware;

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
        if (err) return next(err, false);
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
middleware.use(passport.initialize());
middleware.use(passport.session());



/* ACL */
acl.use( new AclStore() );
middleware.use(function(req, res, next) {
  var groups = ['anonymous']
    , group = req.isAuthenticated() ? req.user[0].role : null;
  
  groups.push(group);
  if (group && (group != 'user')) {
    groups.push('user');
  }

  var ok = false
    , i = groups.length
    , resource = req.method + ':' + req.path;

  var checkGroup = function(err, nextGroup) {
    if (i--) {
      if (groups[i]) {
        acl.assert(groups[i], resource, function(err, check) {
          ok = ok || check;
          nextGroup(err);
        });
      } else nextGroup(err);
    } else {
      if (!ok) return res.send(403, 'Forbidden');
      return next(err);
    }
  };
  var nextGroup = function(err) { checkGroup(err, nextGroup); };
  checkGroup(null, nextGroup);

});



/* dynamicMenu */
middleware.use(function(req, res, next) {
  res.locals.user = req.isAuthenticated() ? req.user[0] : false;
  res.addMenuLink('Users list', '/users');

  var mod_auth = require('../../../lib/lazymods').getMod('auth')
    , app = require('../../../app')
    , step = 0
    , nextStep = function(err) {
        step += 1;
        if (step == 2) next(err);
      };

  app.render(mod_auth.path + mod_auth.name + '/views/menuRegister', {'_locals': res.locals}, function(err, html) {
    if (err) return nextStep(err);

    var registerMenu = new DynamicMenu('registerMenu');
    registerMenu.html = html; 
    res.locals.dynamicMenu.unshift(registerMenu);

    nextStep();
  });

  app.render(mod_auth.path + mod_auth.name + '/views/menuLoginButton', {'_locals': res.locals}, function(err, html) {
    if (err) return nextStep(err);

    var loginMenu = new DynamicMenu('loginButton');
    loginMenu.html = html; 
    res.locals.dynamicMenu.push(loginMenu);

    nextStep();
  });

});

