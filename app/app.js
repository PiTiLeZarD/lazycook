var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , mongoose = require('mongoose');

var app = module.exports = express();

/* Global configs */
app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/* Middlewares */
app.use(express.logger(app.get('env')));
app.use(stylus.middleware( { 
	  src: __dirname + '/public' 
	, compile: function (str, path) { 
		return stylus(str).set('filename', path).use(nib());
	} 
} ));
app.use(express.static(__dirname + '/public'));

if (app.get('env') === 'dev') {
  app.use(express.errorHandler());
}

/* Initialize DB */
var mongurl = 'mongodb://localhost:'+(parseInt(app.get('port')) + 1)+'/lazycook';
console.log('DB attempt to connect on %s', mongurl);
mongoose.connect(mongurl);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB connection error:'));

db.once('open', function callback () {
	console.log('DB connection successful');

	/* Initialise controllers */
	console.log('Routing...')
	require('./lib/boot')(app, { verbose: app.get('env') === 'dev' });

	/* Start server */
	console.log('Express server listening on port ' + app.get('port'));
	app.listen(app.get('port'));
});
