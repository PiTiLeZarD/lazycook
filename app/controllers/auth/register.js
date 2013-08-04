var passport = require('passport')
  , db = require('../../lib/db');

exports.postregister = {
    'path': '/user/register'
  , 'method': 'post'
  , 'fn': function(req, res, next) {
      console.log(req.body.email);
      res.redirect('/user/register');
    }
}

exports.register = {
    'path': '/user/register'
  , 'fn': function(req, res, next) {
      res.render('register');
    }
}
