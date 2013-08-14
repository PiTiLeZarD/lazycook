
var fs = require('fs');

module.exports = function(app, server, options){
  var verbose = options.verbose
    , mods_path = options.mods_path || __dirname + '/../mods/';

  verbose && console.log('Checking modules to extend server');
  fs.readdirSync(mods_path).forEach( function(name) {

    var module = require(mods_path + name)
      , name = module.name || name;

    /* bind middlewares for this module */
    if (module.server) {
      verbose && console.log('     Extending server with module %s', name);
      module.server( app, server, options );
    }

  });
  verbose && console.log('');
};