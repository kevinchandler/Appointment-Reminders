'use strict';

angular.module('remindApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.date'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'MainCtrl'
      })
       .when('/logout', {
          redirectTo: '/'
      })
      .when('/addrecipient', {
        templateUrl: 'views/addrecipient.html',
        controller: 'AddRecipientCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
