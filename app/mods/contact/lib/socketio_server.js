

module.exports = function(app, server, options) {
  var verbose = options.verbose
    , socketio = require('socket.io');

  var io = socketio.listen(server);

  io.sockets.on('connection', function (socket) {
    socket.emit('init', {
        type: 'system'
      , from: 'System'
      , date: Date.now()
      , content: "Connected to livechat"
    });
  });

}