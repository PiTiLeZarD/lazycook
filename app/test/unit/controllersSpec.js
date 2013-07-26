describe('Lazycook controllers', function() {
 
  describe('RecipeListCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/recipes').
          respond([{name: 'Whatever 1'}, {name: 'Whatever 2'}]);
 
      scope = $rootScope.$new();
      ctrl = $controller(RecipeListCtrl, {$scope: scope});
    }));

    it('should create "recipes" model with 2 recipes fetched from xhr', function() {
      expect(scope.recipes).toBeUndefined();
      $httpBackend.flush();
     
      expect(scope.recipes).toEqual([
        {name: 'Whatever 1'}, {name: 'Whatever 2'}
      ]);
    });

  });
});