var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var createTemplateSchema = new Schema({
	username: String,
	templateName: String,
	subject: String,
	message: String
});



module.exports = mongoose.model('Template', createTemplateSchema);          
