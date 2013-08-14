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
      , sessionID = socket.handshake.sessionID;

    if (session.passport.user) {
      db.User.findOne({'login': session.passport.user}, function(err, user) {
        if (err) {
          console.log(err);
          return;
        }

        var obj = {
            'login': user.login
          , 'role': user.role
        };

        socket.emit('user:left', {'login': sessionID});
        socket.emit('user:join', obj);
        socket.emit('login:change', user.login);
      });
    }

    var user = {
        'login': sessionID
      , 'role': 'user'
    };
    socket.emit('init');
    socket.emit('login:change', sessionID);
    socket.emit('user:join', user);
    socket.broadcast.emit('user:join', user);

    socket.emit('send:message', {
        type: 'system'
      , from: 'System'
      , date: Date.now()
      , content: "Connected to livechat"
    });

    socket.on('send:message', function (message) {
      message['type'] = 'remote';
      socket.broadcast.emit('send:message', message);
    });

  });

}