
var express = require('express')
  , fs = require('fs');

module.exports = function(parent, options){
  var verbose = options.verbose;
  fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
    verbose && console.log('\n   %s:', name);
    var obj = require(__dirname + '/../controllers/' + name)
      , name = obj.name || name
      , prefix = obj.prefix || ''
      , app = express();

    app.set('views', parent.get('views'));
    app.set('view engine', parent.get('view engine'));

    // before middleware support
    if (obj.before) {
      path = '/' + name + '/:' + name + '_id';
      app.all(path, obj.before);
      verbose && console.log('     ALL %s -> before', path);
      path = '/' + name + '/:' + name + '_id/*';
      app.all(path, obj.before);
      verbose && console.log('     ALL %s -> before', path);
    }

    // generate routes based
    // on the exported methods
    for (var key in obj) {
      // "reserved" exports
      if (~['name', 'prefix', 'before'].indexOf(key)) continue;
      // route exports
      
      var method = obj[key].method || 'get'
        , path = prefix + (obj[key].path || '/')
        , call = obj[key].fn || function(req, res) { res.redirect('/error/404'); };
        
      verbose && console.log('     %s %s -> %s', method, path, key);
      app[method](path, call);
    }

    // mount the app
    parent.use(app);
  });
};