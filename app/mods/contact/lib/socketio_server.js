var socketio = require('socket.io')
  , connect = require('connect')
  , cookie = require('connect/node_modules/cookie')
  , config = require('../../../config')
  , db = require('../../../lib/db');


module.exports = function(app, server, options) {
  var verbose = options.verbose
    , io = socketio.listen(server)
    , sessionStore = options['sessionStore'] || null;

  /* decode our session cookie, and pass our session along */
  io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
      var parsedCookie = connect.utils.parseSignedCookies(
          cookie.parse(
            decodeURIComponent(data.headers.cookie)
          ), config.secret)
        , sessionID = parsedCookie['connect.sid'];

      data.sessionID = sessionID;

      if (sessionStore) {
        sessionStore.get(data.sessionID, function (err, session) {
          if (err || !session) {
            return accept('Could not fetch the session', false);
          } else {
            data.session = session;
            return accept(null, true);
          }
        });
      } else {
        accept('No sessionStore provided', false);
      }

    } else {
      return accept("You must have a cookie", false);
    }
  });

  /* bind our socket events */
  io.sockets.on('connection', function (socket) {
    var session = socket.handshake.session
      , sessionID = socket.handshake.sessionID
      , init_message = {
            type: 'system'
          , from: 'System'
          , date: Date.now()
          , content: "Connected to livechat"
        };

    if (session.passport.user) {
      db.User.findOne({'login': session.passport.user}, function(err, user) {
        if (err) {
          console.log(err);
          return;
        }

        socket.emit('login:change', user.login);
      });
    }

    socket.emit('login:change', sessionID);

    socket.emit('init', init_message);

    socket.on('send:message', function (message) {
      socket.broadcast.emit('send:message', message);
    });

  });

}