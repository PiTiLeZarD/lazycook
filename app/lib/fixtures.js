
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

console.log('Getting available fixtures...')
fs.readdirSync(__dirname + '/../controllers').forEach(function(controller) {
  var fixtures_path = __dirname + '/../controllers/' + controller + '/fixtures.js';

  if (fs.existsSync(fixtures_path)) {
    console.log('\n   %s:', controller);

    var fixtures = require(fixtures_path);
    for (var obj in fixtures) {
      console.log('     %s', obj);
      module.exports[obj] = fixtures[obj];
    }

  }

});