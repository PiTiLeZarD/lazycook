
var config = require('./config')
  , db = require('./lib/db')
  , fixtures = require('./lib/fixtures')
  , mongoose = require('mongoose');

/* sneak add the session schema */
var sessionSchema = mongoose.Schema({
    sid: String
  , session: String
  , expires: Date
});
db.Session = mongoose.model('Session', sessionSchema);

db.connect(config.mongourl, function(err) {
  if (err) {
    console.log('Exiting...');
    process.exit();
  }

  db.initialize();
  fixtures.initialize();
  

  var tables = Object.keys(db)
    , table_count = tables.length;

  var deleteTable = function(next) {
    if (table_count--) {
      var table = tables[table_count];

      if (!!~db.ignore_keys.indexOf(table)) return next();

      console.log('> deleting %s', table);
      db[table].find().remove(function(err) {
        if (table in fixtures) {
          console.log('> %s done, adding fixtures', table);
          fixtures[table](function() {
            console.log('> fixtures for %s done', table);
            next();
          });
        } else {
          next();
        }
      });

    } else {
      console.log('All tables done, exiting!')
      process.exit(0);
    }
  }; 

  var next = function() {
    deleteTable(next);
  };
  deleteTable(next);
});

