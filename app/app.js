var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , db = require('./lib/db')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var app = module.exports = express();

/* Global configs */
app.configure( function (){
  app.set('port', process.env.PORT);
  app.set('database', process.env.DATABASE);
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

/* Authentication */
passport.use(new LocalStrategy(
  function(login, password, next) {
    User.findOne({ login: login }, function(err, user) {
      if (err) return next(err);

      if (!user) {
        return next(null, false, { message: 'Incorrect login.' });
      }
      if (!user.validPassword(password)) {
        return next(null, false, { message: 'Incorrect password.' });
      }
      return next(null, user);
    });
  }
));

/* Initialize DB */
db.connect('localhost', parseInt(app.get('port')) + 1, app.get('database'), function(err) {
  if (err) {
    console.log('Exiting...');
    process.exit();
  }
  /* Initialise controllers */
  console.log('Routing...')
  require('./lib/boot')(app, { verbose: app.get('env') === 'dev' });

  /* Start server */
  console.log('Express server listening on port ' + app.get('port'));
  app.listen(app.get('port'));
});
