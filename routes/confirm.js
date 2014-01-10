
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
		sent: Boolean
	});

	var Reminder = db.model('Reminder', findReminderSchema);

  Reminder.findOne({'_id' : reminderId}, function(err, reply){  
  		console.dir(reply);
  		var query = { confirmed: 'false'}; //query param for false flag in the db 
					Reminder.update(query, { confirmed: 'true' }, function(err, res) { //updates false flag to true
                    })
		mongoose.connection.close();
		res.send('Thanks, you\'re confirmed!');
	})
})
}