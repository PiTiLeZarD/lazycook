
var db = require('./db');

module.exports.Phone = function(callback) {
  
  var phones = [
    {
        "name": "Nexus S"
      , "snippet": "Fast just got faster with Nexus S."
      , "age": 0
    }, {
        "name": "Motorola XOOM™ with Wi-Fi"
      , "snippet": "The Next, Next Generation tablet."
      , "age": 1
    }, {
        "name": "MOTOROLA XOOM™"
      , "snippet": "The Next, Next Generation tablet."
      , "age": 2
    }
  ];

  var phones_saved = 0;
  phones.forEach( function(phone) {
    new db.Phone(phone).save(function(err) {
      phones_saved += 1;
      if (phones_saved == phones.length) {
        callback();
      }
    });
  });

};
