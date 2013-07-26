
var db = require('../../lib/db');

exports.index = {
    'fn': function(req, res){
      res.render('index', { title : 'Home' });
    }
};

exports.recipes = {
    'path' : '/recipes'
  , 'fn': function(req, res){
      db.Recipe.find(function(err, recipes) {
        res.json(recipes);
      });
    }
};
