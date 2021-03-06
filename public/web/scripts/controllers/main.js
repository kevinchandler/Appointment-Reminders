

angular.module('remindApp')

  .controller('MainCtrl', function ($scope) { //handles main page, gatekeeper to /dashboard
})

 .controller('DashboardCtrl', function ($scope) { //once logged in..
    $scope.today = moment().toString().slice(4, 15).replace(/\s+/g, '/'); //= jan/10/2014)
})

 .controller('CreateReminderCtrl', function ($scope, $http) {
 	$http({method: 'GET', url: '/api/findrecipients'}).
  		success(function(data, status, headers, config) {
  			$scope.recipients = data; //repeats over each recipient in the view
  		});

  $scope.createReminder = function() {
    function formatDate() {
        reminder_date = $scope.reminder_date.toString().slice(4, 15).replace(/\s+/g, '/')
      , appointment_date = $scope.appointment_date.toString().slice(4, 15).replace(/\s+/g, '/');
    }
    formatDate();

    $http({
    url: '/api/createreminder',
    method: "POST",
    data: {
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

.controller('FindReminderCtrl', function ($scope, $http)  {
    function findReminders(){ //reload reminders
    $http({
      url: '/api/findreminders',
      method: 'GET'}).
        success(function(reminders, status) {
          $scope.reminders = reminders;
        })
  } findReminders();


    $scope.sendReminder = function() {
      $http({
        url: '/api/sendreminder/' + this.reminder._id,
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
      url: '/api/deletereminder/' + this.reminder._id,
      method: 'DELETE'}).
        success(function(reminders, status) {
          findReminders();
      })
      }
})


.controller('AddRecipientCtrl', function ($scope) {

})
