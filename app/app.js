var config = require('./config')
  , express = require('express')
  , stylus = require('stylus')
  , db = require('./lib/db')
  , MongoStore = require('connect-mongo')(express)
  , expressValidator = require('express-validator')
  , flash = require('connect-flash');

var app = module.exports = express();

/* Global configs */
app.configure( function (){
  app.set('port', config.port || 4000);
  app.set('mongourl', config.mongourl);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.logger(app.get('env')));
  app.use(express.favicon());
  app.use(express.compress());
  app.use(stylus.middleware( { 
      src: __dirname + '/public' 
    , compile: function (str, path) { 
        return stylus(str).set('filename', path);
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
  var options = { verbose: app.get('env') === 'dev' };

  db.initialize(options);

  /* sessions */
  var sessionStore = options['sessionStore'] = new MongoStore({ 'db' : db.mongo });
  app.use(express.cookieParser());
  app.use(express.session({
      secret: config.secret
    , maxAge: new Date(Date.now() + 3600000)
    , store: sessionStore
  })); 
  app.use(flash());

  /* view helpers*/
  app.use(function(req, res, next){
    res.locals.session = req.session;
    res.locals.reveal = 'reveal' in req.query;
    res.locals.flash =  req.flash.bind(req);

    next();
  });

  /* our dynamic menu */
  require('./lib/dynamicMenu').middleware(app);

  /* basic param error handling */
  app.use(function(req, res, next) {
    req.assertErrorsToHome = function() {
      var errors = req.validationErrors();
      if (errors && errors.length) {
        var messages = null;
        errors.forEach(function(val) {
          (messages = messages || []).push(val['msg']);
        });
        req.flash('messages', messages);
        return res.redirect('/');
      }
      return false;
    };
    next();
  });

  /* Initialize controllers, routing... */
  require('./lib/boot')(app, options);

  /* Start server */
  console.log('Express server listening on port ' + app.get('port'));
  var server = app.listen(app.get('port'));

  /* reuse our server (socket.io and others...) */
  require('./lib/servers')(app, server, options);

});
