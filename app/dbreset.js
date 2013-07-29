
var db = require('./lib/db')
  , fixtures = require('./lib/fixtures');

db.connect('localhost', parseInt(process.env.PORT) + 1, function() {
  console.log('DB connection successful');

  var table_ignore = ['connect']
    , table_count = Object.keys(db).length
    , table_done = table_ignore.length; 

  for (table in db) {
    if (table_ignore.indexOf(table) >= 0) continue;

    console.log('> deleting %s', table);
    db[table].find().remove(function() {
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

