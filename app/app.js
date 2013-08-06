var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , db = require('./lib/db')
  , MongoStore = require('connect-mongo')(express)
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , expressValidator = require('express-validator')
  , flash = require('connect-flash');

var app = module.exports = express();

/* Global configs */
app.configure( function (){
  app.set('port', process.env.PORT);
  app.set('mongourl', process.env.MONGOURL);
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
  app.use(express.bodyParser());
  app.use(expressValidator());
});

app.configure( 'dev', function (){
  app.use( express.errorHandler({ dumpExceptions : true, showStack : true }));
});
app.configure( 'prod', function (){
  app.use( express.errorHandler());
});

/* Initialize DB */
db.connect(app.get('mongourl'), function(err) {
  if (err) {
    console.log('Exiting...');
    process.exit();
  }

  /* sessions */
  app.use(express.cookieParser());
  app.use(express.session({
      secret:'Im clark kent'
    , maxAge: new Date(Date.now() + 3600000)
    , store: new MongoStore({ 'db' : db.mongo })
  })); 
  app.use(flash());

  /* passport authentication */
  passport.use(new LocalStrategy(
      {
          'usernameField': 'login'
        , 'passwordField': 'password'
      }
    , function(login, password, next) {
        db.User.findOne({ login: login }, function(err, user) {
          if (err) return next(err);

          if (!user) {
            return next(null, false, { message: 'Incorrect login.' });
          }
          
          user.comparePassword(password, function(err, isMatch) {
            if (err) next(err, false);
            if (isMatch) {
              console.log('User %s logged in', login);
              next(null, user);
            }
            else next(null, false, { message: 'Incorrect password.' });
          });

        });
      }
  ));
  passport.serializeUser(function(user, done) {
    done(null, user.login);
  });
  passport.deserializeUser(function(login, done) {
    db.User.find({'login': login}, done);
  });
  app.use(passport.initialize());
  app.use(passport.session());

  /* view helpers*/
  app.use(function(req, res, next){
    res.locals.session = req.session;
    res.locals.user = req.isAuthenticated() ? req.user[0] : false;
    res.locals.reveal = 'reveal' in req.query;
    res.locals.flash =  req.flash.bind(req);

    next();
  });

  /* Initialise controllers, routing... */
  require('./lib/boot')(app, { verbose: app.get('env') === 'dev' });

  /* Start server */
  console.log('Express server listening on port ' + app.get('port'));
  app.listen(app.get('port'));
});
