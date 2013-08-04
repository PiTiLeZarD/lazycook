
var login = require('./login')
  , register = require('./register');


[login, register].forEach(function(ctrl) {
  for (exp in ctrl) {
    exports[exp] = ctrl[exp];
  }
});