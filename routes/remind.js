var dotenv = require('dotenv')
, mongoose = require('mongoose')
, uristring =
  	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost:27017/remindalpha';
var moment = require('moment');
dotenv.load();

	function sendReminder(reminder) {
		var id = reminder._id
		,	recipient_email = reminder.recipient_email
		,	appointment_date = reminder.appointment_date
		,	appointment_time = reminder.appointment_time;

		var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
		sendgrid.send({
		  to: recipient_email,
		  from: process.env.FROM_EMAIL,
		  subject: 'Your appointment reminder from ' + process.env.BUSINESS_NAME,
		  html: 'Hello! Just a friendly reminder about your appointment on: ' + appointment_date + ' at ' + appointment_time + " <br /><br /> <a href='http://" + process.env.BUSINESS_WEBSITE + '/confirm/'+id + "'>Confirm appointment</a> <br /> <a href='http://" + process.env.BUSINESS_WEBSITE + '/cancel/'+id + "'>Cancel appoitment</a> <br /> <br /> If you've already confirmed and something comes up, you can always come back to cancel or confirm your appointment; just click on the relevant link above. <br /> \n <br /> " + process.env.BUSINESS_NAME + "<br />" + process.env.BUSINESS_PHONE + '<br />' + process.env.BUSINESS_ADDRESS + "<br />" + "<br />" + "<p></p><br />"
		}, function(success, message) {
		  if (!success) {
		  	return 500
		  }
		})
		console.log('message success');
		markSent(reminder);
	};



function markSent(reminder) {
   console.log('marksent reminderId' + reminder._id);
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
       Reminder.findById(reminder._id, function (err, reminder) {
         var query = { username: reminder.username, _id: reminder._id };
       Reminder.update(query, { sent: 'true' }, function(err, res) {  //updates false flag to true
          })
     })
   })
   mongoose.connection.close();
 }



//---------------------------------------//

// exports.createtemplate = function(req, res) {

// 	var Template = require('../public/js/createTemplateSchema.js')
// 	, templateName = req.body.templatename
// 	, username = req.body.username
// 	, subject = req.body.subject
// 	, message = req.body.message;

// 	mongoose.connect(uristring);

// 	var userTemplate = new Template({
// 	  username: username,
// 	  templateName: templateName,
// 	  subject: subject,
// 	  message: message
// 	})

// 	userTemplate.save(function(err) {
// 		if(err) console.log(err);
// 			mongoose.connection.close();
// 		res.redirect('#/dashboard/remind');
// 	})
// }


exports.createreminder = function(req, res) {
	var Reminder = require('../public/js/createReminderSchema.js');

	mongoose.connect(uristring);

	var reminder = new Reminder({
		username: req.session.user,
		recipient_name: req.body.recipient_name,
		recipient_email: req.body.recipient_email,
		reminder_date: req.body.reminder_date,
		appointment_date: req.body.appointment_date,
		appointment_time: req.body.appointment_time,
		confirmed: 'false',
		cancelled: 'false',
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
	

	//validate the email addresses
	var re = /[^@]+@[^.]+(\.[^.]+)+/
	
		var validateEmail = re.exec(req.body.recipientEmail); 
		if (!validateEmail) {
			console.log('invalid email!');
			res.redirect('/#error');
		}
		else {
		mongoose.connect(uristring);

		var addRecipient = new Recipient({
		  username: req.session.user,
		  recipientName: req.body.recipientName,
		  recipientEmail: req.body.recipientEmail
		});

		addRecipient.save(function(err, recipient) {
			if(err) console.log(err);
			else {
				console.log(recipient);
			}
		})
		//lets you know if there are any invalid email addresses & what they are
		mongoose.connection.close();
		res.redirect('#/');
		}	
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

		Recipient.find({ username : req.session.user }, function(err, recipient) {
			res.json(recipient);
			mongoose.connection.close();
		})
	})
};

//---------------------------------------//

// exports.findtemplate = function(req, res) {
// 	var db = mongoose.createConnection(uristring);
// 	db.once('open', function(){

// 		var templateSchema = mongoose.Schema({
// 			username: String,
// 			templateName: String,
// 			subject: String,
// 			message: String
// 		}); 

// 		var Template = db.model('Template', templateSchema);
// 		Template.find({message: ''}, function(err, template){	
// 		 	res.json(template);
// 		 	mongoose.connection.close();
// 		})
// 	})
// };

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
		cancelled: Boolean,
		sent: Boolean
	});

		var Reminder = db.model('Reminder', findReminderSchema);

		Reminder.find({username: req.session.user}, function(err, reminder) {
			res.json(reminder); //the view for the reminders on the dashboard
			

			//loops through reminders and will send any unsent ones. Ajax'd from angular
			for (var i=0; i< reminder.length; i++) {
				if ((reminder[i].reminder_date == now) && (reminder[i].sent == false)) { // && (reminder[i].sent == 'false')) { //if reminder date and not sent, send. 
					sendReminder(reminder[i]);
					var query = { username: reminder.username, sent: 'false', reminder_date: reminder[i].reminder_date }; //query param for false flag in the db 
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
		cancelled: Boolean,
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