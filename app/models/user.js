
var mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , SALT = 10;

var userSchema = mongoose.Schema({
    login        : { type: String, required: true, unique: true }
  , password     : { type: String, required: true }
  , email        : { type: String, required: true, unique: true }
  , role         : { type: String, default: 'user' }
});

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);

    cb(null, isMatch);
  });
};

module.exports.User = mongoose.model('User', userSchema);