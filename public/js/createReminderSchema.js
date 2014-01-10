//module.exports is the object that's actually returned as the result 
//of a require call.



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var createReminderSchema = new Schema({
	username: String,
	recipient_name: String,
	recipient_email: String,
	reminder_date: String,
	appointment_date: String,
	confirmed: Boolean,
	sent: Boolean
});



module.exports = mongoose.model('Reminder', createReminderSchema);          
