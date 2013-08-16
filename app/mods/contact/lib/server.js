var socketio = require('socket.io')
  , connect = require('connect')
  , cookie = require('connect/node_modules/cookie')
  , config = require('../../../config')
  , db = require('../../../lib/db');


module.exports = function(server, options) {
  var verbose = options.verbose
    , io = socketio.listen(server)
    , sessionStore = options['sessionStore'] || null;

  io.set('authorization', function(data, accept) {
    if (!sessionStore) {
      return accept('No sessionStore provided', false);
    } 
    return authorization(sessionStore, data, accept);
  });

  /* bind our socket events */
  io.sockets.on('connection', function (socket) {
    var session = socket.handshake.session
      , sessionID = socket.handshake.sessionID
      , livechatID = session['livechatID'];

    db.Livechat.findOne({_id: livechatID}, function(err, livechat) {
      if (err || !livechat) {
        console.log('Unable to launch livechat ' + livechatID + ' err:', err)
        return;
      }
      init_livechat(err, livechat, session, socket, function(session, fn) {
        sessionStore.set(sessionID, session, fn || function(){});
      });
    });

  });

};

var authorization = function (sessionStore, data, accept) {
  /* decode our session cookie, and pass our session along */
  if (data.headers.cookie) {
    var parsedCookie = connect.utils.parseSignedCookies(
        cookie.parse(
          decodeURIComponent(data.headers.cookie)
        ), config.secret)
      , sessionID = parsedCookie['connect.sid'];

    data.sessionID = sessionID;

    sessionStore.get(data.sessionID, function (err, session) {
      if (err || !session) {
        return accept('Could not fetch the session', false);
      } else {
        data.session = session;

        var livechatID = session['livechatID'] || null;
        if (!livechatID) {
          return accept('No livechat initiated', false);
        }
        return accept(null, true);
      }
    });

  } else {
    return accept("You must have a cookie", false);
  }
};

var init_livechat = function(err, livechat, session, socket, save) {
  var handleError = function(err) {
    console.log(err);
    socket.emit('error', err);
    return false;
  }
  if (err) return handleError(err);

  var uid = session['livechatUID']
    , user = null;

  if (session.passport.user) {
    /* try to get our logged user from the list */
    livechat.users.forEach(function(u) {
      if (u.login == session.passport.user) {
        user = u;
      }
    });
  }

  if (!user) {
    /* ok try to get our anonymous user from this list */
    livechat.users.forEach(function(u) {
      if (u.login == uid) {
        user = u;
      }
    });
  }

  if (user && (user.login == uid) && session.passport.user) {
    /* ok here we somehow logged in in between */
    socket.emit('user:left', user);
    socket.broadcast.emit('user:left', user);
    user = null;
  }

  var sendHistory = function(user) {
    var messages = [];
    livechat.messages.forEach( function(m) {
      var message = {
          from: m.from
        , type: (-1 != [""+uid, user ? user.login : null].indexOf(m.from)) ? 'local' : 'remote'
        , date: m.date
        , content: m.content
      }
      messages.push(message);
    } );
    socket.emit('init:messages', messages);
  }

  var userJoin = function(u) {
    livechat.users.push(u);
    livechat.save(function(err) {
      if (err) return handleError(err);
      socket.emit('login:change', u.login);
      socket.broadcast.emit('user:join', u);
      sendHistory(user);
    });
  };

  if (!user) {
    /* we're new here, so let's join the chat */

    if (session.passport.user) {
      /* if we're logged in */
      db.User.findOne({'login': session.passport.user}, function(err, dbuser) {
        if (err) return handleError(err);
        user = {
            'login': dbuser.login
          , 'role': dbuser.role
        };
        userJoin(user);
      });
    } else {
      /* Anonymous */
      user = {
          'login': uid
        , 'role': 'user'
      };
      userJoin(user);
    }
  }

  socket.emit('init');
  socket.emit('init:users', livechat.users);
  socket.emit('send:message', {
      type: 'system'
    , from: 'System'
    , date: Date.now()
    , content: "Connected to livechat"
  });
  if (user) {
    socket.emit('login:change', user.login);
    sendHistory(user);
  }

  socket.on('send:message', function (message) {
    livechat.messages.push(message);
    livechat.save(function(err) {
      if (err) return handleError(err);
      message['type'] = 'remote';
      socket.broadcast.emit('send:message', message);
    });
  });

  socket.on('user:left', function () {
    var users = [];
    livechat.users.forEach(function(u) {
      if (u.login != user.login) users.push(u);
    });
    livechat.users = users;
    livechat.save(function(err) {
      if (err) return handleError(err);
      socket.broadcast.emit('user:left', user);
    });
  });

};