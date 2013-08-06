
var login = require('./login')
  , register = require('./register');


[login, register].forEach(function(ctrl) {
  for (exp in ctrl) {
    exports[exp] = ctrl[exp];
  }
});

exports.dynamicHelpers = function(req, res, next) {
    res.locals.user = req.isAuthenticated() ? req.user[0] : false;
    next();
};