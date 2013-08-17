"use strict";

module.exports = function(validation) {
  return function(req, res, next) {
    var url = validation(req) || '/'
      , errors = req.validationErrors();

    if (errors && errors.length) {
      var messages = null;
      errors.forEach(function(val) {
        (messages = messages || []).push(val['msg']);
      });
      req.flash('messages', messages);
      return res.redirect(url);
    }

    next();
  };
};
