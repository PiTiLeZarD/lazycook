
var express = require('express')
  , stylus = require('stylus')
  , fs = require('fs');

module.exports = function(parent, options){
  var verbose = options.verbose
    , mods_path = options.mods_path || __dirname + '/../mods/';

  verbose && console.log('Routing using path %s...', mods_path)
  fs.readdirSync(mods_path).forEach( function(name) {
    verbose && console.log('\n   Module %s:', name);

    var module = require(mods_path + name)
      , name = module.name || name
      , prefix = module.prefix || ''
      , app = express()
      , viewengine = module.viewengine || parent.get('view engine');

    /* statics for this module */
    var public_path = mods_path + name + '/public/';
    if (fs.existsSync(public_path)) {
      verbose && console.log('     Public found here %s', public_path);

      /* check for use of stylus in this public folder */
      var use_stylus = false;
      fs.readdirSync(public_path).forEach(function(elt) {
        if (/\.styl$/.test(elt)) use_stylus = true;
      });
      if (use_stylus) {
        verbose && console.log('       Using stylus');
        app.use(stylus.middleware( { 
            src: public_path
          , compile: function (str, path) { 
              return stylus(str).set('filename', path);
            } 
        } ));
      }

      verbose && console.log('       Monting public on /public/%s/', name)
      app.use('/public/' + name, express.static(public_path));
    }

    app.set('env', parent.get('env'));
    app.set('views', mods_path + name + '/views/');
    app.set('view engine', viewengine);

    /* bind middlewares for this module */
    if (module.middlewares) {
      verbose && console.log('     has middlewares');
      module.middlewares( app, options );
    }

    /* before middleware support */
    if (module.before) {
      path = '/' + name + '/:' + name + '_id';
      app.all(path, module.before);
      verbose && console.log('     ALL %s -> before', path);
      path = '/' + name + '/:' + name + '_id/*';
      app.all(path, module.before);
      verbose && console.log('     ALL %s -> before', path);
    }

    /* Bind all calls */
    var controller_path = mods_path + name + '/controllers/';
    fs.readdirSync(controller_path).forEach( function(controller_name) {
      verbose && console.log('     Controller %s:', controller_name);

      var controller = require(controller_path + controller_name);
      for (key in controller) {

        var method = controller[key].method || 'get'
          , path = prefix + (controller[key].path || '/')
          , call = controller[key].fn || function(req, res) { res.redirect('/error/404'); };
          
        verbose && console.log('       %s %s -> %s', method, path, key);

        app[method](path, call);

      }
      
    });
    verbose && console.log('');
    /* mount the controller to the main app */
    parent.use(app);
  });
};