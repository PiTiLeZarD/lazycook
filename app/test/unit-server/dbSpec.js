describe('Database', function() {

  var db = require('../../lib/db');

  it('should have a User class', function() {
    expect(db.User).toBeDefined();
  });

  it('should connect when asked', function() {
    expect(db.connect).toEqual( jasmine.any(Function) );

    var connected = false;
    db.connect('localhost', parseInt(process.env['PORT']) + 1, function(err) { 
      connected = !err; 
    });
    waitsFor(function() { return connected; }, 'Should connect', 1000);

    runs(function() {
      expect(connected).toBe(true);

      describe('Connected database', function() {
        it('should have at least one admin', function() {
          db.User.find({'role': 'admin'}, function(err, users) {
            expect(err).toBeNull();
            expect(users.length).toBeGreaterThan(0);
            asyncSpecDone();
          });
        });
        asyncSpecWait();
      });
    });

  });

});