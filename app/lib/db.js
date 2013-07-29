
var mongoose = require('mongoose')
  , ignore_keys = []
  , fs = require('fs');

ignore_keys.push('connect');
module.exports.connect = function(host, port, database, next) {
  if (mongoose.connection.db) return next(null);

  var mongurl = 'mongodb://'+host+':'+port+'/'+database;
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

fs.readdirSync(__dirname + '/../models').forEach(function(name) {
  console.log('\n   model %s:', name);
  var obj = require(__dirname + '/../models/' + name);

  for (model in obj) {
    console.log('   -> %s', model);
    module.exports[model] = obj[model];
  }
});