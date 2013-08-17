"use strict";

var db = require('../../../lib/db');

exports.contact = {
    'path': '/contact'
  , 'fn': function(req, res, next) {
      res.render('contact');
    }
};


exports.postcontact = {
    'path': '/contact'
  , 'method': 'post'
  , 'validation': function(req) {
      req.assert('email', 'Valid email required').isEmail();
      req.assert('fullname', 'You need a fullname').notEmpty();
      req.assert('message', 'You need to type a content for your message').notEmpty();
      
      return '/contact';
    }
  , 'fn': function(req, res, next) {
      new db.Contact({
          fullname: req.body.fullname
        , email: req.body.email
        , content: req.body.message
      }).save(function(err) {
        if (err) return next(err);
        req.flash('messages', ['We have your details and will contact you soon.']);
        return res.redirect('/');
      });
    }
};
