

angular.module('remindApp')

  .controller('MainCtrl', function ($scope) { //handles main page, gatekeeper to /dashboard
})
 
 .controller('DashboardCtrl', function ($scope) { //once logged in..
  
})

 .controller('CreateReminderCtrl', function ($scope, $http) {
 	$http({method: 'GET', url: 'http://localhost:3000/api/re-mind/findrecipients'}).
  		success(function(data, status, headers, config) {
  			$scope.recipients = data; //repeats over reach recipient in the view
  		});
      
      var date = new Date
      , reminder_day_year
      , appointment_day_year
      , reminder_month
      , appointment_month;

  $scope.createReminder = function() {
    function formatDate() {
        reminder_day_year = $scope.reminder_date.toString().slice(4, 15).replace(/\s+/g, '/')
      , appointment_day_year = $scope.appointment_date.toString().slice(4, 15).replace(/\s+/g, '/');
    }
    formatDate();

    $http({
    url: 'http://localhost:3000/api/re-mind/createreminder',
    method: "POST",
    data: { 
      'username' : 'admin',
      'recipient_name' : $scope.recipient.recipientName,
      'recipient_email' : $scope.recipient.recipientEmail,
      'appointment_date' : appointment_day_year, //formatted from formatDate() 
      'reminder_date' : reminder_day_year  //formatted from formatDate()
     }
})
.then(function(response) {
        alert('successfully saved')
        window.location.reload(true);
        
    }, 
    function(response) { // optional
        alert(response)
  })
}
})

.controller('ReminderCtrl', function ($scope, $http)  {
  function findReminders(){
    $http({
      url: 'http://localhost:3000/api/re-mind/findreminders',
      method: 'GET'}).
        success(function(reminders, status) {
          $scope.reminders = reminders;
        })
  }
  findReminders();
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