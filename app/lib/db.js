
var mongoose = require('mongoose');

var phoneSchema = mongoose.Schema({
	  name		: String
	, snippet	: String
	, age		: Number
});

module.exports.Phone = mongoose.model('Phone', phoneSchema);