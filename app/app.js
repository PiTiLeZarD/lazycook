var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , db = require('./lib/db')
  , MongoStore = require('connect-mongo')(express)
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

  /* view helpers*/
  app.use(function(req, res, next){
    res.locals.session = req.session;
    res.locals.reveal = 'reveal' in req.query;
    res.locals.flash =  req.flash.bind(req);

    next();
  });

  /* our dynamic menu */
  require('./lib/dynamicMenu').middleware(app);

  /* Initialise controllers, routing... */
  require('./lib/boot')(app, { verbose: app.get('env') === 'dev' });

  /* Start server */
  console.log('Express server listening on port ' + app.get('port'));
  app.listen(app.get('port'));
});
