
var mongoose = require('mongoose')
  , ignore_keys = [];

ignore_keys.push('connect');
module.exports.connect = function(mongurl, next) {
  if (mongoose.connection.db) return next(null);

  console.log('DB attempt to connect on %s', mongurl);
  mongoose.connect( mongurl, { db: { safe: true } } );
  mongoose.connection.on('error', function(err) {
    console.log('DB connection error:', err);
    next(err);
  });
  mongoose.connection.once('open', function() {
    console.log('DB connection successful');
    module.exports.mongo = mongoose.connection.db;
    next(null);
  });
};

ignore_keys.push('mongo');
module.exports.mongo = null;

ignore_keys.push('ignore_keys');
module.exports.ignore_keys = ignore_keys;

ignore_keys.push('initialize');
module.exports.initialize = function(options) {
  require('./lazymods')(options).forEach(function(mod) {
    mod.models().forEach(function(data) {
      module.exports[data['name']] = data['model'];
    });
  });
};
