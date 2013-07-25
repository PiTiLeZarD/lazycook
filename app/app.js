var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');

var app = module.exports = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
};

app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.use(express.logger(app.get('env')));
app.use(stylus.middleware( { src: __dirname + '/public' , compile: compile } ));
app.use(express.static(__dirname + '/public'));

if (app.get('env') === 'dev') {
  app.use(express.errorHandler());
}

require('./lib/boot')(app, { verbose: app.get('env') === 'dev' });

console.log('Express server listening on port ' + app.get('port'));
app.listen(app.get('port'));
