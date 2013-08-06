var passport = require('passport')
  , db = require('../../lib/db');

exports.postregister = {
    'path': '/user/register'
  , 'method': 'post'
  , 'fn': function(req, res, next) {
      req.assert('email', 'Valid email required').isEmail();

      var errors = req.validationErrors();
      if (errors.length) {
        var messages = null;
        errors.forEach(function(val) {
          (messages = messages || []).push(val['msg']);
        });
        req.flash('messages', messages);
      }
      
      res.redirect('/user/register');
    }
}

exports.register = {
    'path': '/user/register'
  , 'fn': function(req, res, next) {
      res.render('register');
    }
}
