'use strict'

angular.module '<%= scriptAppName %>'
<% if(filters.ngroute) { %>.config ($routeProvider) ->
  $routeProvider
  .when '/login',
    templateUrl: 'app/account/login/login.html'
    controller: 'LoginController'

  .when '/signup',
    templateUrl: 'app/account/signup/signup.html'
    controller: 'SignupController'

  .when '/settings',
    templateUrl: 'app/account/settings/settings.html'
    controller: 'SettingsController'
    authenticate: true
<% } %><% if(filters.uirouter) { %>.config ($stateProvider) ->
  $stateProvider
  .state 'login',
    url: '/login'
    templateUrl: 'app/account/login/login.html'
    controller: 'LoginController'

  .state 'signup',
    url: '/signup'
    templateUrl: 'app/account/signup/signup.html'
    controller: 'SignupController'

  .state 'settings',
    url: '/settings'
    templateUrl: 'app/account/settings/settings.html'
    controller: 'SettingsController'
    authenticate: true
<% } %>