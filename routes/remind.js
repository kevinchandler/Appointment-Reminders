var dotenv = require('dotenv')
, mongoose = require('mongoose')
, uristring =
  	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/remindalpha';
var moment = require('moment');
dotenv.load();

	function sendReminder(reminder) {
		console.log(reminder);
		var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
		sendgrid.send({
		  to: reminder.recipient_email,
		  from: 'reminder@imkev.in',
		  subject: 'Your reminder',
		  text: 'Please confirm your appointment for: ' + reminder.appointment_date + '\n http://localhost:3000' + '/confirm/'+reminder._id
		}, function(success, message) {
		  if (!success) {
		  	return 500
		  }
		})
		console.log('message success');
		markSent(reminder._id);
	}


	function markSent(reminderId) {
		console.log('marksent reminderId' + reminderId);
		var db = mongoose.createConnection(uristring);
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
			  Reminder.findById(reminderId, function (err, reminder) {
			  	var query = { _id: reminderId };
				Reminder.update(query, { sent: 'true' }, function(err, res) {  //updates false flag to true
				console.log(res);
		       })
			})
		})
		mongoose.connection.close();
	}



//---------------------------------------//

exports.createtemplate = function(req, res) {

	var Template = require('../public/js/createTemplateSchema.js')
	, templateName = req.body.templatename
	, username = req.body.username
	, subject = req.body.subject
	, message = req.body.message;

	mongoose.connect(uristring);

	var userTemplate = new Template({
	  username: username,
	  templateName: templateName,
	  subject: subject,
	  message: message
	})

	userTemplate.save(function(err) {
		if(err) console.log(err);
			mongoose.connection.close();
		res.redirect('#/dashboard/remind');
	})
}


exports.createreminder = function(req, res) {
	var Reminder = require('../public/js/createReminderSchema.js');

	mongoose.connect(uristring);

	var reminder = new Reminder({
		username: req.body.username,
		recipient_name: req.body.recipient_name,
		recipient_email: req.body.recipient_email,
		reminder_date: req.body.reminder_date,
		appointment_date: req.body.appointment_date,
		confirmed: 'false',
		sent: 'false'
	})

	reminder.save(function(err) {
		if(err) console.log(err);
		mongoose.connection.close();
		res.redirect('#/dashboard/remind');
	})
}

//---------------------------------------//

exports.addrecipients = function(req, res) {
	var Recipient = require('../public/js/addRecipientsSchema.js');
	mongoose.connect(uristring);

	//validate the email addresses
	var re = /[^@]+@[^.]+(\.[^.]+)+/
	
		var validateEmail = re.exec(req.body.recipientEmail); 
		if (!validateEmail) {
			console.log('invalid email!')
			return;
		}

		var addRecipient = new Recipient({
		  username: 'im.kevin@me.com',
		  recipientName: req.body.recipientName,
		  recipientEmail: req.body.recipientEmail
		});

		addRecipient.save(function(err) {
			if(err) console.log(err);
		})
		//lets you know if there are any invalid email addresses & what they are
		mongoose.connection.close();
		res.redirect('#/dashboard/remind');
}

//---------------------------------------//

exports.findrecipients = function(req, res) {
	var db = mongoose.createConnection(uristring);

		db.once('open', function(){

		var recipientSchema = mongoose.Schema({
			username: String,
			recipientName: String,
			recipientEmail: String
		}); 

		var Recipient = db.model('Recipient', recipientSchema);

		Recipient.find( function(err, recipient) {
			res.json(recipient);
			mongoose.connection.close();
		})
	})
};

//---------------------------------------//

exports.findtemplate = function(req, res) {
	var db = mongoose.createConnection(uristring);
	db.once('open', function(){

		var templateSchema = mongoose.Schema({
			username: String,
			templateName: String,
			subject: String,
			message: String
		}); 

		var Template = db.model('Template', templateSchema);
		Template.find({message: 'hhh'}, function(err, template){	
		 	res.send(template);
		 	mongoose.connection.close();
		})
	})
};

//---------------------------------------//

exports.findreminders = function(req, res) {
	var now = moment()._d.toString().slice(4, 15).replace(/\s+/g, '/'); //jan/05/2014
	var db = mongoose.createConnection(uristring);

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

		Reminder.find( function(err, reminder) {
			res.json(reminder); //the view for the reminders on the dashboard
			for (var i=0; i< reminder.length; i++) {
				if ((reminder[i].reminder_date == now) && (reminder[i].sent == false)) { // && (reminder[i].sent == 'false')) { //if reminder date and not sent, send. 
					var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
					sendgrid.send({
					  to: reminder[i].recipient_email,
					  from: 'reminder@imkev.in',
					  subject: 'Your reminder',
					  text: 'Please confirm your appointment for: ' + reminder[i].appointment_date + '\n http://localhost:3000' + '/confirm/'+reminder[i]._id
					}, function(success, message) {
					  if (!success) {
					  	return 500
					  }
					});
					var query = { sent: 'false', reminder_date: reminder[i].reminder_date }; //query param for false flag in the db 
					Reminder.update(query, { sent: 'true' }, function(err, res) { //updates false flag to true
                    })
				}
			}
			mongoose.connection.close();
		})
	})
};

exports.deletereminder = function(req, res) {

	var db = mongoose.createConnection(uristring);

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
  return Reminder.findById(req.params.id, function (err, reminder) {
    return reminder.remove(function (err) {
      if (!err) {
        console.log(reminder + " reminder removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });		
})
}


exports.sendreminder = function(req, res) {
	sendReminder(req.body.reminder);
}