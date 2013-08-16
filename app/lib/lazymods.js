"use strict";

var express = require('express')
  , stylus = require('stylus')
  , fs = require('fs')
  , acl = require('simple-acl')
  , MODLIST = [];

module.exports = function(options) {
  if (MODLIST.length) return MODLIST;

  var options = options || {'verbose': false}
    , verbose = options.verbose || false
    , mods_path = options.mods_path || __dirname + '/../mods/';

  verbose && console.log('Initializing mods from %s...', mods_path)
  fs.readdirSync(mods_path).forEach( function(name) {
    MODLIST.push( new Lazymod(mods_path, name, options) );
  });
  verbose && console.log('Found %s mods', MODLIST.length);

  return MODLIST;
}
module.exports.Lazymod = Lazymod;
module.exports.getMod = function(name) {
  var mod = null;
  MODLIST.forEach(function(m) {
    if (m.name == name) mod = m;
  });
  return mod;
}

var Lazymod = function(path, name, options) {
  this.options = options || {'verbose': false};
  this.init(path, name);
};

Lazymod.prototype.init = function(path, name) {
  this.path = path;
  this.name = name;
};

Lazymod.prototype.log = function(message) {
  var message = ' - ' + this.name + ' - ' + message
    , args = [message]
    , i = 0;

  while (i++ < arguments.length - 1) args.push( arguments[i] );

  this.options.verbose && console.log.apply(console, args);
};

Lazymod.prototype.routing = function(parent) {
  var module = require(this.path + this.name)
    , name = module.name || this.name
    , prefix = module.prefix || ''
    , app = express()
    , viewengine = module.viewengine || parent.get('view engine')
    , self = this;

  self.log('Routing...');
  /* statics for this module */
  var public_path = self.path + self.name + '/public/';
  if (fs.existsSync(public_path)) {
    self.log('  Public found here %s', public_path);

    /* check for use of stylus in this public folder */
    var use_stylus = false;
    fs.readdirSync(public_path).forEach(function(elt) {
      if (/\.styl$/.test(elt)) use_stylus = true;
    });
    if (use_stylus) {
      self.log('    Using stylus');
      app.use(stylus.middleware( { 
          src: public_path
        , compile: function (str, path) { 
            return stylus(str).set('filename', path);
          } 
      } ));
    }

    self.log('    Monting public on /public/%s/', name)
    app.use('/public/' + name, express.static(public_path));

    var match = 'GET:/public/' + name + '/**';
    acl.grant('anonymous', match, function() {
      self.log('    ACL: %s -> %s', 'anonymous', match);
    });
  }

  app.set('env', parent.get('env'));
  app.set('views', self.path + self.name + '/views/');
  app.set('view engine', viewengine);

  /* Bind all calls */
  var controller_path = self.path + self.name + '/controllers/';
  fs.readdirSync(controller_path).forEach( function(controller_name) {
    self.log('  Controller %s:', controller_name);

    var controller = require(controller_path + controller_name);
    for (var key in controller) {

      var method = controller[key].method || 'get'
        , path = prefix + (controller[key].path || '/')
        , call = controller[key].fn || function(req, res) { res.redirect('/error/404'); }
        , groups = controller[key].groups || ['anonymous'];
      
      groups.forEach(function(group) {
        var match = method.toUpperCase() + ':' + path.replace(/\/(:[^\/]+)/g, '/*');
        acl.grant(group, match, function() {
          self.log('    ACL: %s -> %s', group, match);
        });
      });
      self.log('    VERB: %s -> %s %s', method, path, key);

      app[method](path, call);
    }
    
  });

  /* mount the controller to the main app */
  parent.use(app);
};

Lazymod.prototype.models = function() {
  var model_path = this.path + this.name + '/models/'
    , self = this
    , models = [];

  if (fs.existsSync(model_path)) {
    fs.readdirSync(model_path).forEach(function(model_name) {
      if (model_name != 'fixtures.js') {

        self.log('Model %s', model_name)
        var model = require(model_path + model_name);
        for (var obj in model) {
          self.log(' > %s', obj);
          models.push({
              name: obj
            , model: model[obj]
          })
        }

      }
    });
  }

  return models;
};


Lazymod.prototype.middleware = function() {
  var path = this.path + this.name + '/lib/middleware.js'
    , self = this;

  if (fs.existsSync(path)) {
    this.log('has middlware');
    return require(path);
  }

  return null;
};


Lazymod.prototype.useServer = function(server, options) {
  var path = this.path + this.name + '/lib/server.js'
    , self = this;

  if (fs.existsSync(path)) {
    this.log('reuse server');
    require(path)(server, options);
  }

};
