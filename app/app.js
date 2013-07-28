var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , db = require('./lib/db');

var app = module.exports = express();

/* Global configs */
app.configure( function (){
  app.set('port', process.env.PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.logger(app.get('env')));
  app.use(express.favicon());
  app.use(express.compress());
  app.use(stylus.middleware( { 
      src: __dirname + '/public' 
    , compile: function (str, path) { 
      return stylus(str).set('filename', path).use(nib());
    } 
  } ));
  app.use(express.static(__dirname + '/public'));
});

app.configure( 'dev', function (){
  app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
});
app.configure( 'prod', function (){
  app.use( express.errorHandler());
});

/* Initialize DB */
var conn = db.connect('localhost', parseInt(app.get('port')) + 1);
conn.once('open', function callback () {
  console.log('DB connection successful');

  /* Initialise controllers */
  console.log('Routing...')
  require('./lib/boot')(app, { verbose: app.get('env') === 'dev' });

  /* Start server */
  console.log('Express server listening on port ' + app.get('port'));
  app.listen(app.get('port'));
});
