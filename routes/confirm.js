
//confirm should accept a post that takes in the reminder id and a yes/no/maybe with a message 
var dotenv = require('dotenv')
, mongoose = require('mongoose')
, uristring =
  	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/remindalpha';
dotenv.load();

exports.index = function(req, res) {
	var reminderId = req.params.id
	,	db = mongoose.createConnection(uristring);

	db.once('open', function(){

	var findReminderSchema = mongoose.Schema({
		username: String,
		recipient_email: String,
		reminder_date: String,
		appointment_date: String,
		confirmed: Boolean,
		cancelled: Boolean,
		sent: Boolean
	});

	var Reminder = db.model('Reminder', findReminderSchema);

  Reminder.findOne({'_id' : reminderId}, function(err, reminder){  
  		if (reminder == null) {
  			res.redirect('/');
  		} else {
  		
  		var query = {_id: reminder._id }; //query param for false flag in the db 
  		
  		if (reminder.confirmed == true) {
			return res.send('you\'ve already confirmed your appointment');	
        } 
        else {
        	Reminder.update(query, { confirmed: 'true', cancelled: 'false' }, function(err, res) { //updates false flag to true

        	})
        }
    }
		mongoose.connection.close();
		res.send('Thanks, you\'re confirmed!');
	})
})
}




exports.cancel = function(req, res) {
	var reminderId = req.params.id
	,	db = mongoose.createConnection(uristring);

	db.once('open', function(){

	var findReminderSchema = mongoose.Schema({
		username: String,
		recipient_email: String,
		reminder_date: String,
		appointment_date: String,
		confirmed: Boolean,
		cancelled: Boolean,
		sent: Boolean
	});

	var Reminder = db.model('Reminder', findReminderSchema);
	
  Reminder.findOne({'_id' : reminderId}, function(err, reminder){  
  		if (reminder == null) {
  			res.redirect('/');
  		} else {
  		
  			var query = { _id: reminder._id }; //query param for false flag in the db 
  		
        	Reminder.update(query, { cancelled: 'true', confirmed: 'false' }, function(err, res) { //updates false flag to true
        	})
    }
		mongoose.connection.close();
		res.end('You have successfully cancelled your appointment');
	})
})
}