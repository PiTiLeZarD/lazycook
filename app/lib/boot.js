
var express = require('express')
  , fs = require('fs');

module.exports = function(parent, options){
  var verbose = options.verbose;

  console.log('Routing...')
  fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
    verbose && console.log('\n   %s:', name);

    var obj = require(__dirname + '/../controllers/' + name)
      , name = obj.name || name
      , prefix = obj.prefix || ''
      , app = express()
      , viewengine = obj.viewengine || parent.get('view engine');

    app.set('env', parent.get('env'));
    app.set('views', __dirname + '/../controllers/' + name);
    app.set('view engine', viewengine);

    /* bind middlewares for this module */
    if (obj.middlewares) {
      verbose && console.log('     has middlewares');
      obj.middlewares( app, options );
    }

    /* before middleware support */
    if (obj.before) {
      path = '/' + name + '/:' + name + '_id';
      app.all(path, obj.before);
      verbose && console.log('     ALL %s -> before', path);
      path = '/' + name + '/:' + name + '_id/*';
      app.all(path, obj.before);
      verbose && console.log('     ALL %s -> before', path);
    }

    /* Bind all calls */
    for (var key in obj) {
      // "reserved" exports
      if (~['name', 'prefix', 'before', 'middlewares'].indexOf(key)) continue;
      // route exports
      
      var method = obj[key].method || 'get'
        , path = prefix + (obj[key].path || '/')
        , call = obj[key].fn || function(req, res) { res.redirect('/error/404'); };
        
      verbose && console.log('     %s %s -> %s', method, path, key);

      app[method](path, call);
    }

    /* mount the controller to the main app */
    parent.use(app);
  });
};