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
       .when('/dashboard', {
        templateUrl: '../views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/dashboard/create-template', {
        templateUrl: '../views/createtemplate.html',
        controller: 'CreateTemplateCtrl'
      })
      .when('/dashboard/add-recipient', {
        templateUrl: '../views/addrecipient.html',
        controller: 'CreateTemplateCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
