describe('Authentication', function() {

  var db = require('../../lib/db');

  it('should connect and', function() {
    var connected = false;
    db.connect('localhost', parseInt(process.env['PORT']) + 1, function(err) { 
      connected = !err; 
    });
    waitsFor(function() { return connected; }, 'Should connect', 1000);

    runs(function() {
      expect(connected).toBe(true);

      describe('Connected Authentication', function() {

        it('should crypt the password', function() {
          var user = new db.User({'login': 'test', 'password': 'test'});
          expect(user.password).toBeDefined();
          expect(user.password).not.toBeNull();
          expect(user.password).not.toBe('test');
        });

      });
    });
  });

});