
var mongoose = require('mongoose');

module.exports.connect = function(host, port) {
	var mongurl = 'mongodb://'+host+':'+port+'/lazycook';
	console.log('DB attempt to connect on %s', mongurl);
	mongoose.connect(mongurl);
	var conn = mongoose.connection;
	conn.on('error', console.error.bind(console, 'DB connection error:'));
	return conn;
};

var phoneSchema = mongoose.Schema({
	  name		: String
	, snippet	: String
	, age		: Number
});

module.exports.Phone = mongoose.model('Phone', phoneSchema);