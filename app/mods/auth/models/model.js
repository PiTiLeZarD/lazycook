
var config = require('../../../config')
  , mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , SALT = 10;

var userSchema = mongoose.Schema({
    login        : { type: String, required: true, unique: true }
  , password     : { type: String, default: null }
  , email        : { type: String, required: true, unique: true }
  , role         : { type: String, default: 'user' }
  , date_create  : { type: Date,   default: Date.now }
  , emails       : [
    {
        text: String
      , from: String
      , subject: String
      , attachment: [{
            data: String
          , path: String
          , name: String
          , type: String
        }]
      , date: { type: Date, default: Date.now }
    }
  ]
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

userSchema.methods.sendRegisterEmail = function(cb) {
  var self = this
    , nodemailer = require("nodemailer")
    , transport = nodemailer.createTransport("SMTP", config.smtp)
    , message = {
          from :    "Lazycook <lazycook@mailinator.com>"
        , to :      this.email
        , subject : "Registration email"
        , text :    "Use this link to confirm http://localhost:4000/user/confirm/" + this.login
        , html: '<html><a href="http://localhost:4000/user/confirm/'+this.login+'">Click here to confirm</a></html>'
      };

  transport.sendMail(message, function(err, response){
    self.emails.push(message);
    transport.close();
    cb(err, response);
  });
};

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);

    cb(null, isMatch);
  });
};

module.exports.User = mongoose.model('User', userSchema);
