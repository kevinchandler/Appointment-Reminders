var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addrecipientsSchema = new Schema({
	username: String,
	recipientName: String,
	recipientEmail: String
});


module.exports = mongoose.model('Recipient', addrecipientsSchema);          

