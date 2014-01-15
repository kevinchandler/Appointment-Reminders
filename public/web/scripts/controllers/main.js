

angular.module('remindApp')

  .controller('MainCtrl', function ($scope) { //handles main page, gatekeeper to /dashboard
})
 
 .controller('DashboardCtrl', function ($scope) { //once logged in..
    $scope.today = moment().toString().slice(4, 15).replace(/\s+/g, '/'); //= jan/10/2014)
})

 .controller('CreateReminderCtrl', function ($scope, $http) {
 	$http({method: 'GET', url: 'http://localhost:3000/api/re-mind/findrecipients'}).
  		success(function(data, status, headers, config) {
  			$scope.recipients = data; //repeats over reach recipient in the view
  		});

  $scope.createReminder = function() {
    function formatDate() {
        reminder_date = $scope.reminder_date.toString().slice(4, 15).replace(/\s+/g, '/')
      , appointment_date = $scope.appointment_date.toString().slice(4, 15).replace(/\s+/g, '/');
    }
    formatDate();

    $http({
    url: 'http://localhost:3000/api/re-mind/createreminder',
    method: "POST",
    data: { 
      'username' : 'admin',
      'recipient_name' : $scope.recipient.recipientName,
      'recipient_email' : $scope.recipient.recipientEmail,
      'appointment_date' : appointment_date, //formatted from formatDate()
      'appointment_time' : $scope.appointment_time,
      'reminder_date' : reminder_date  //formatted from formatDate()
     }
})
.then(function(response) {
        window.location.reload();        
    }, 
    function(response) { // optional
        alert(response)
  })
}
})

.controller('ReminderCtrl', function ($scope, $http)  {
    function findReminders(){ //reload reminders
    $http({
      url: 'http://localhost:3000/api/re-mind/findreminders',
      method: 'GET'}).
        success(function(reminders, status) {
          $scope.reminders = reminders;
        })
  } findReminders();


    $scope.sendReminder = function() {
      $http({
        url: 'http://localhost:3000/api/re-mind/sendreminder/' + this.reminder._id,
        method: 'POST',
        data: { 
        'reminder' : this.reminder
     }}).
      
      success(function(reminders, status) {
      })
      findReminders();
    }

    $scope.deleteReminder = function() {
      $http({
      url: 'http://localhost:3000/api/re-mind/deletereminder/' + this.reminder._id,
      method: 'DELETE'}).
        success(function(reminders, status) {
          findReminders();
      })
      }
})

.controller('CreateTemplateCtrl', function ($scope) {
	
	
})

.controller('AddRecipientCtrl', function ($scope) {
	
	
})