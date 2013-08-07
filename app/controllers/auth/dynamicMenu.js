
module.exports = function(req, res, menu) {
  menu.addBlock('first', res.render('menuRegister'));
  menu.addBlock('right', res.render('menuLoginButton'));
  menu.addItem('/users/list');
};
