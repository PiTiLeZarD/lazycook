"use strict";

var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({
    date: { type: Date, default: Date.now }
  , fullname: String
  , email: String
  , content: String
});


module.exports.Contact = mongoose.model('Contact', contactSchema);