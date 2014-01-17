
//confirm should accept a post that takes in the reminder id and a yes/no/maybe with a message 
var dotenv = require('dotenv')
, mongoose = require('mongoose')
, uristring =
  	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/remindalpha';
dotenv.load();

exports.index = function(req, res) {
	var _id = req.params.id
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

	  Reminder.findOne({_id : _id}, function(err, reminder){ 
	  	// var query = { _id: reminder._id }; //query param for false flag in the db 
  		
  		// if (reminder == null) {
  		// 	res.redirect('/');
  		// } 
  		
  		if (reminder.confirmed == false) {
       		Reminder.update({ _id: reminder._id }, { confirmed: 'true', cancelled: 'false' }, function(err, res) { //updates false flag to true	        
        		})
       		res.render('confirm', { message: 'Thanks you\'ve successfully confirmed your appointment. You can always cancel anytime by clicking the "cancel appointment" link in the email you received'}); //pass in id so we can link to /cancel/ from /confirm/
        } 
	        else {
				res.render('confirm', {message: 'You\'ve already confirmed your appointment! You can always cancel anytime by clicking the "cancel appointment" link in the email you received'});

	    	}
		})
   		mongoose.connection.close();
})
}



exports.cancel = function(req, res) {
	var _id = req.params.id
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

	  Reminder.findOne({_id : _id}, function(err, reminder){ 
	  	// var query = { _id: reminder._id }; //query param for false flag in the db 
  		
  		// if (reminder == null) {
  		// 	res.redirect('/');
  		// } 
  		
  		if (reminder.cancelled == false) {
       		Reminder.update({ _id: reminder._id }, { confirmed: 'false', cancelled: 'true' }, function(err, res) { //updates false flag to true	        
        		})
       		res.render('cancel', { message: 'You\'ve successfully cancelled your appointment. You can always confirm anytime by clicking the "confirm appointment" link in the email you received'}); //pass in id so we can link to /cancel/ from /confirm/
        } 
	        else {
				res.render('cancel', {message: 'You\'ve already cancelled your appointment! You can always cancel anytime by clicking the "confirm appointment" link in the email you received'});

	    	}
		})
   		mongoose.connection.close();
})
}
