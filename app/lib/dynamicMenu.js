
var express = require('express');

var DynamicMenu = function(id) {
  this.id = id;
  this.data = [];
  this.title = {'name': 'Menu', 'href': '#'};
  this.html = null;
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

module.exports.DynamicMenu = DynamicMenu;

module.exports.middleware = function(req, res, next) {

  /* our menu list, feel free to tweak it */
  res.locals.dynamicMenu = [ new DynamicMenu('dynamicMenu') ];

  /* add a convenience function */
  res.addMenuLink = function(name, href, title) {
    res.locals.dynamicMenu.forEach( function(menu) {
      if (menu.id == 'dynamicMenu') menu.addLink(name, href, title);
    });
  };

  next();
};


