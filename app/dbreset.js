
var config = require('./config')
  , db = require('./lib/db')
  , fixtures = require('./lib/fixtures');

db.connect(config.mongourl, function(err) {
  if (err) {
    console.log('Exiting...');
    process.exit();
  }

  db.initialize();
  fixtures.initialize();
  
  var table_count = Object.keys(db).length
  
  var deleteTable = function(next) {
    if (table_count--) {
      var table = Object.keys(db)[table_count];

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

