

module.exports = function(req, res, next) {
  res.addMenuLink('Contact', '/contact');
  next();
}