
module.exports = function(req, res, menu) {
  menu.addBlock('first', 'register_miniform');
  menu.addBlock('last', 'auth_button');
  menu.addItem('/users/list');
};
