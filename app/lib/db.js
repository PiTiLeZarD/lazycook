
var mongoose = require('mongoose')
  , ignore_keys = []
  , fs = require('fs');

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

console.log('Binding models...')
fs.readdirSync(__dirname + '/../controllers').forEach(function(controller) {
  var model_path = __dirname + '/../controllers/' + controller + '/model.js';

  if (fs.existsSync(model_path)) {
    console.log('\n   %s:', controller);

    var model = model = require(model_path);
    for (var obj in model) {
      console.log('     %s', obj);
      module.exports[obj] = model[obj];
    }

  }

});