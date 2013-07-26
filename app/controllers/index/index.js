
var db = require('../../lib/db');

exports.index = {
    'fn': function(req, res){
      res.render('index', { title : 'Home' });
    }
};

exports.phones = {
    'path' : '/phones'
  , 'fn': function(req, res){
      db.Phone.find(function(err, phones) {
        res.json(phones);
      });
    }
};
