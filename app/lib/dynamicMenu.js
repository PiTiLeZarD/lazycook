
var fs = require('fs');

var menuFunctions = [];

console.log('Binding dynamicMenu for')
fs.readdirSync(__dirname + '/../controllers').forEach(function(controller) {
  var basePath = __dirname + '/../controllers/' + controller
    , menu_path = basePath + '/dynamicMenu.js';

  if (fs.existsSync(menu_path)) {
    console.log('   %s', controller);
    menuFunctions.push([basePath, require(menu_path)]);
  }

});

var DynamicMenu = function() {
  this.blocks = {};
  this.defaultMenu = [];
};
DynamicMenu.prototype.addBlock = function(position, html) {
  (this.blocks[position] = this.blocks[position] || []).push(html);
};
DynamicMenu.prototype.addItem = function(html) {
  this.defaultMenu.push(html);
};


module.exports = function(req, res, next) {
	var dynamicMenu = new DynamicMenu();

  menuFunctions.forEach( function(data) {
    var basePath = data[0]
      , menuFn = data[1];

    menuFn(req, res, dynamicMenu);
  });
  
  console.log(dynamicMenu.blocks);
  console.log(dynamicMenu.defaultMenu);

	res.locals.dynamicMenu = dynamicMenu;

	next();
}