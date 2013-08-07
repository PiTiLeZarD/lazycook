
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

var mods_path = __dirname + '/../mods/'; 
console.log('Binding models using path %s...', mods_path)
fs.readdirSync(mods_path).forEach(function(mod) {
  var model_path = __dirname + '/../mods/' + mod + '/models/';

  if (fs.existsSync(model_path)) {
    console.log('\n   Module %s:', mod);

    fs.readdirSync(model_path).forEach(function(model_name) {
      if (model_name != 'fixtures.js') {

        console.log('     Model %s', model_name)
        var model = require(model_path + model_name);
        for (var obj in model) {
          console.log('       %s', obj);
          module.exports[obj] = model[obj];
        }

      }
    });
  }

});
console.log('');