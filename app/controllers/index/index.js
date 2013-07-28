
var db = require('../../lib/db');

exports.index = {
    'fn': function(req, res){
      res.render('index', { title : 'Lazycook' });
    }
};

