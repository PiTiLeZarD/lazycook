
var express = require('express')
  , fs = require('fs');

var DynamicMenu = function(id) {
  this.id = id;
  this.data = [];
  this.title = {'name': 'Menu', 'href': '#'};
};
DynamicMenu.prototype.addItem = function(item) {
  this.data.push(item);
};
DynamicMenu.prototype.setTitle = function(name, href, title) {
  this.title = {
      'name': name
    , 'href': href || '#'
    , 'title': title || name
  };
};
DynamicMenu.prototype.addLink = function(name, href, title) {
  this.addItem({
      'name': name
    , 'href': href || '#'
    , 'title': title || name
  });
};


module.exports = function(parent) {
  var app = express();

  app.use(function(req, res, next) {
    var mainMenu = new DynamicMenu('main');

    var submenu = new DynamicMenu('sub');
    submenu.setTitle('SubMenu');

    var subsubmenu = new DynamicMenu('subsub');
    subsubmenu.setTitle('SubSubMenu');
    subsubmenu.addLink('Menu test');
    subsubmenu.addLink('Menu test2');
    subsubmenu.addLink('Menu test3');
    subsubmenu.addLink('Menu test4');

    submenu.addItem(subsubmenu);
    mainMenu.addItem(submenu);

    var mainMenu2 = new DynamicMenu('main2');
    mainMenu2.setTitle('Other Menu');


    res.locals.dynamicMenu = [mainMenu, mainMenu2];
    next();
  });

  parent.use(app);
};


