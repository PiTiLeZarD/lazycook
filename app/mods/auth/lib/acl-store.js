"use strict";

var MemoryStore = require('simple-acl').MemoryStore;

module.exports = (function() {

  var defer = process.nextTick;

  var AclStore = function() {
    this.rights = { };
  };

  AclStore = MemoryStore;
  AclStore.prototype.assert = function(grantee, resource, callback) {
    var list = this.rights[grantee]
      , ok = false;

    list.forEach(function(elt) {
      var regexp = '^' + elt.replace('/**', '/.*').replace('/*', '/[^/]*') + '$';
      if (!ok) ok = (elt == resource);
      if (!ok) ok = resource.match( new RegExp( regexp, 'g') );
    });

    defer(function() { callback(null, !!ok); });
  }

  return AclStore;

})();
