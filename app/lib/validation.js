

module.exports.middleware = function(req, res, next) {
  req.assertErrorsToHome = function() {
    var errors = req.validationErrors();
    if (errors && errors.length) {
      var messages = null;
      errors.forEach(function(val) {
        (messages = messages || []).push(val['msg']);
      });
      req.flash('messages', messages);
      return res.redirect('/');
    }
    return false;
  };
  next();
}