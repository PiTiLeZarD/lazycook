
var db = require('./db')
  , fs = require('fs');


module.exports.clearDB = function(done) {
  db.mongo.collections(function(err, collections){
    if (err) return done(err);

    var todo = collections.length;
    if (!todo) return done();

    collections.forEach(function(collection){
      if (collection.collectionName.match(/^system\./)) return --todo;

      collection.remove({},{safe: true}, function() {
        if (--todo === 0) done();
      });
    });
  });
};

var mods_path = __dirname + '/../mods/'; 
console.log('Getting available fixtures with path %s...', mods_path)
fs.readdirSync(mods_path).forEach(function(mod) {
  var fixtures_path = mods_path + mod + '/models/fixtures.js';

  if (fs.existsSync(fixtures_path)) {
    console.log('\n   Module %s:', mod);

    var fixtures = require(fixtures_path);
    for (var obj in fixtures) {
      console.log('       %s', obj);
      module.exports[obj] = fixtures[obj];
    }

  }

});