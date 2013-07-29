var expect = require('chai').expect
  , fixtures = require('../../lib/fixtures')
  , db = require('../../lib/db')
  , PORT = parseInt(process.env['PORT']) + 1
  , DATABASE = process.env['DATABASE'];

describe('Database', function() {

  before(function(done) {
    db.connect('localhost', PORT, DATABASE, done);
  });

  before(function(done) {
    fixtures.clearDB(done);
  });

  it('should have a User class', function() {
    expect(db.User).to.exist;
  });

  it('should have no users', function(done) {
    db.User.find(function(err, users) {
      expect(err).to.be.null;
      expect(users.length).to.equal(0);
      done();
    });
  });

  it('should fill the database with users', function(done) {
    fixtures.User(done);
  });

  it('should have one admin', function(done) {
    db.User.find({'role': 'admin'}, function(err, users) {
      expect(err).to.be.null;
      expect(users.length).to.equal(1);
      done();
    });
  });

  it('should have one 4 users', function(done) {
    db.User.find({'role': 'user'}, function(err, users) {
      expect(err).to.be.null;
      expect(users.length).to.equal(4);
      done();
    });
  });

});