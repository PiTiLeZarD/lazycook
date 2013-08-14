'use strict';

/* Controllers */

var UsersCtrl = ['$scope', '$http', function($scope, $http) {
  $http.get('/users/list.json').success(function(data) {
    $scope.users = data;
  });
}];