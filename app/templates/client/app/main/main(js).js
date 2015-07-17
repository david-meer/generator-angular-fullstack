(function() {

'use strict';

angular
    .module('<%= scriptAppName %>')
    <% if(filters.ngroute) { %>.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/main/main.html',
                controller: 'MainController'
            });
    });<% } %><% if(filters.uirouter) { %>.config(function ($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainController'
            });
    });<% } %>
})();
