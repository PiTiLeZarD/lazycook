"use strict";

var mongoose = require('mongoose');

var livechatSchema = mongoose.Schema({
    date : { type: Date, default: Date.now }
  , messages : [{
        from: String
      , date: { type: Date, default: Date.now }
      , content: String
    }]
  , users: [{
        login: String
      , role: String
    }] 
});


module.exports.Livechat = mongoose.model('Livechat', livechatSchema);
