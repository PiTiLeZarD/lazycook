describe('PhoneCat controllers', function() {
 
  describe('PhoneListCtrl', function(){
    var scope, ctrl;

    beforeEach(function() {
      scope = {};
      ctrl = new PhoneListCtrl(scope);
    });

    it('should create "phones" model with 3 phones', function() {
      expect(scope.phones.length).toBe(3);
    });

    it('should have a DB Version', function() {
      expect(scope.DB_VERSION).toBeDefined();
    });

    it('should set the default value of orderProp to age', function() {
      expect(scope.orderProp).toBe('age');
    });
    
  });
});