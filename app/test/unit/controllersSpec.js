describe('PhoneCat controllers', function() {
 
  describe('PhoneListCtrl', function(){
 
    it('should create "phones" model with 3 phones', function() {
      var scope = {},
          ctrl = new PhoneListCtrl(scope);
 
      expect(scope.phones.length).toBe(3);
    });

    it('should have a DB Version', function() {
      var scope = {},
          ctrl = new PhoneListCtrl(scope);

      expect(scope.DB_VERSION).toBeDefined();
    })
  });
});