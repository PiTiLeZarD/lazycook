
var db = require('./lib/db')
  , fixtures = require('./lib/fixtures');

db.connect('localhost', parseInt(process.env.PORT) + 1, process.env.DATABASE, function(err) {
  if (err) {
    console.log('Exiting...');
    process.exit();
  }
  
  var table_count = Object.keys(db).length
    , table_done = db.ignore_keys.length; 

  for (var table in db) {
    if (db.ignore_keys.indexOf(table) !== -1) continue;

    console.log('> deleting %s', table);
    db[table].find().remove(function(err) {
      console.log('> %s done, adding fixtures', table);
      fixtures[table](function() {
        console.log('> fixtures for %s done', table);
        table_done += 1;
        if (table_done == table_count) {
          console.log('All tables done, exiting!')
          process.exit();
        }
      });
    });
  }
});

