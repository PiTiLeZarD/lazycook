'use strict';

var scrollBottom = function( $elt ) {
  var elt = $elt.get(0);
  elt.scrollTop = elt.scrollHeight - $elt.height();
}

angular.module('lazycook', []).factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

/* Controllers */

var LiveChatCtrl = ['$scope', 'socket', function($scope, socket) {

  socket.on('init', function () {
    /* TODO: add initial messages and users here */
    $scope.messages = [];
    $scope.users = [];
    $scope.login = null;
    console.log('init');
  });

  socket.on('user:join', function (user) {
    $scope.users.push(user);
  });

  socket.on('user:left', function (user) {
    var users = [];
    $.each( $scope.users, function(i, elt) {
      if (elt.login != user.login) users.push(elt);
    });
    $scope.users = users;
  });

  socket.on('login:change', function (login) {
    $scope.login = login;
  });
  
  socket.on('send:message', function (message) {
    $scope.messages.push(message);
    scrollBottom( $('#chat') );
  });

  $scope.sendMessage = function () {
    var message = {
        type: 'local'
      , from: $scope.login
      , date: Date.now()
      , content: $scope.message
    };

    socket.emit('send:message', message);
    $scope.messages.push(message);
    scrollBottom( $('#chat') );

    // clear message box
    $scope.message = '';
  };

}];