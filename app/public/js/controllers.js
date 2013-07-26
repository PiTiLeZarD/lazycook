var PhoneListCtrl = ['$scope', '$http', function ($scope, $http) {
  $http.get('/phones').success(function(data) {
      $scope.phones = data;
  });

  $scope.DB_VERSION = '3.0.1';

  $scope.orderProp = 'age';
}];