
var db = require('./db');

module.exports.Recipe = function(callback) {
  
  var recipes = [
    {
        "name": "Petite courgette farcie"
      , "excerpt": "Voilà ma courgette ronde farcie avec mes produits préférés de l'été : tomate confite, poivron rouge, basilic, mozzarella!"
      , "preparation": "Cuire 15 minutes dans une eau bouillante les petites courgettes. Les égoutter. Couper le chapeau et les évider. Essorer la chair de courgette et la couper en petits dés. Réserver."
      , "ingredients": "8 petites courgettes rondes. 150g de veau. 100g de lard fumé. 1 oeuf. 1 tranche de Pain de mie type Harrys. 1 oignon. 1 petit poivron rouge. 1 boule de mozzarella"
    }, {
        "name": "Roulés de saumon Temari ball & fromage frais"
      , "excerpt": "Ces délicieux roulés de saumon renferment une farce au fromage frais très gourmande. Vous allez adorer."
      , "preparation": "Coupez en minuscules morceaux les tomates cerises (en retirant les pépins), le concombre et le poivron jaune. Emincez finement la ciboulette. Dans un récipient, écrasez à la fourchette le fromage de chèvre. Ajoutez-y la Mayonnaise de Dijon Amora pour assouplir le tout. A l'aide d'une fourchette, incorporez délicatement les"
      , "ingredients": "6 tranches de saumon. 1/2 fromage de chèvre frais de type Petit Billy. 2 c à s de Mayonnaise de Dijon Amora. 1/4 concombre. 1/2 poivron jaune. 1 poignée de tomates cerise. Ciboulette. Zeste de citron vert. Sel de Guérande. Poivre."
    }
  ];

  var recipes_saved = 0;
  recipes.forEach( function(recipe) {
    new db.Recipe(recipe).save(function(err) {
      recipes_saved += 1;
      if (recipes_saved == recipes.length) {
        callback();
      }
    });
  });

};
