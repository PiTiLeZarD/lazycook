
var DynamicMenu = require('../../../lib/dynamicMenu').DynamicMenu;

module.exports = function( app, options ) {
  var verbose = options.verbose;

  /* our dynamic helper */
  app.use(function(req, res, next) {
    res.addMenuLink('Contact', '/contact');
    next();
  });
}