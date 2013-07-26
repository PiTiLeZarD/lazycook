describe('Lazycook App', function() {
 
  describe('Recipe list view', function() {
 
    beforeEach(function() {
      browser().navigateTo('/');
    });
 
 
    it('should filter the recipes list as user types into the search box', function() {
      expect(repeater('.recipes li').count()).toBe(3);
 
      input('query').enter('nexus');
      expect(repeater('.recipes li').count()).toBe(1);
 
      input('query').enter('motorola');
      expect(repeater('.recipes li').count()).toBe(2);
    });

    it('should be possible to control recipes order via the drop down select box', function() {
      //let's narrow the dataset to make the test assertions shorter
      input('query').enter('tablet');
 
      expect(repeater('.recipes li', 'Phone List').column('phone.name')).
          toEqual(["Motorola XOOM\u2122 with Wi-Fi",
                   "MOTOROLA XOOM\u2122"]);
 
      select('orderProp').option('Alphabetical');
 
      expect(repeater('.recipes li', 'Phone List').column('phone.name')).
          toEqual(["MOTOROLA XOOM\u2122",
                   "Motorola XOOM\u2122 with Wi-Fi"]);
    });

  });
});