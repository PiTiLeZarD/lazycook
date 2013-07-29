var expect = require('chai').expect
  , fixtures = require('../../lib/fixtures')
  , db = require('../../lib/db')
  , PORT = parseInt(process.env['PORT']) + 1
  , DATABASE = process.env['DATABASE'];

describe('Authentication', function() {

  before(function(done) {
    db.connect('localhost', PORT, DATABASE, done);
  });

  before(function(done) {
    fixtures.clearDB(done);
  });

  it('should crypt the password', function(done) {
    var user = new db.User({
        'login': 'test'
      , 'password': 'test'
      , 'email': 'test@mailinator.com'
    });
    expect(user.password).to.exist;
    expect(user.password).not.to.be.null;
    expect(user.password).to.equal('test');
    user.save(function(err) {
      if (err) done(err);
      expect(user.password).not.to.equal('test');
      done();
    })
  });

});