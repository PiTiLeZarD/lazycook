var passport = require('passport')
  , db = require('../../../lib/db');

module.exports.postregister = {
    'path': '/user/register'
  , 'method': 'post'
  , 'fn': function(req, res, next) {
      req.assert('email', 'Valid email required').isEmail();

      var errors = req.validationErrors();
      if (errors && errors.length) {
        var messages = null;
        errors.forEach(function(val) {
          (messages = messages || []).push(val['msg']);
        });
        req.flash('messages', messages);
        return res.redirect('/');
      }
      
      req.flash('register_email', req.body.email);
      res.redirect('/user/register');
    }
}

module.exports.register = {
    'path': '/user/register'
  , 'fn': function(req, res, next) {
      var email = req.flash('register_email');
      console.log(email);
      if (!email || !email.length) return res.redirect('/');

      res.render('register', {'email': email});
    }
}
