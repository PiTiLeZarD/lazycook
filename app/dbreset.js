var mongoose = require('mongoose');

var port = parseInt(process.env.PORT);

/* Initialize DB */
var mongurl = 'mongodb://localhost:'+(port + 1)+'/lazycook';
console.log('DB attempt to connect on %s', mongurl);
mongoose.connect(mongurl);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB connection error:'));

db.once('open', function callback () {
	console.log('DB connection successful');

	var db = require('./lib/db')
	  , fixtures = require('./lib/fixtures');

	var table_count = Object.keys(db).length;
	var table_done = 0;

	for (table in db) {
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
