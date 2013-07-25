var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib');

var app = module.exports = express()

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev')) /*TODO: get this var from the makefile */
app.use(stylus.middleware( { src: __dirname + '/public' , compile: compile } ))
app.use(express.static(__dirname + '/public'))

require('./lib/boot')(app, { verbose: !module.parent });

console.log('Listening to localhost:4000')
app.listen(4000)