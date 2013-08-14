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
  $scope.messages = [];
  $scope.login = null;

  socket.on('init', function (message) {
    $scope.messages.push(message);
  });

  socket.on('login:change', function (login) {
    $scope.login = login;
  });
  
  socket.on('send:message', function (message) {
    $scope.messages.push(message);
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

    // clear message box
    $scope.message = '';
  };

}];
