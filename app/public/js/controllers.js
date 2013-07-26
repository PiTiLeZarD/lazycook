var RecipeListCtrl = ['$scope', '$http', function ($scope, $http) {
  $http.get('/recipes').success(function(data) {
      $scope.recipes = data;
  });
}];