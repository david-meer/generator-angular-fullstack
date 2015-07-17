(function() {

'use strict';

angular
    .module('<%= scriptAppName %>', [<%= angularModules %>    ])
    <% if(filters.ngroute) { %>.config(function ($routeProvider, $locationProvider<% if(filters.auth) { %>, $httpProvider<% } %>) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);<% if(filters.auth) { %>
        $httpProvider.interceptors.push('authInterceptor');<% } %>
    })<% } %><% if(filters.uirouter) { %>.config(['$stateProvider', '$urlRouterProvider', '$locationProvider'<% if(filters.auth) { %>, '$httpProvider'<% } %>, routeConfig])<% } %><% if(filters.auth) { %>
    .factory('authInterceptor', ['$rootScope', '$q', '$cookieStore', '$location', authInterceptor])
    .run(['$rootScope', '$location', 'Auth', run])<% } %>;
<% if(filters.uirouter) { %>
function routeConfig($stateProvider, $urlRouterProvider, $locationProvider<% if(filters.auth) { %>, $httpProvider<% } %>) {
    $urlRouterProvider
        .otherwise('/');

    $locationProvider.html5Mode(true);<% if(filters.auth) { %>
    $httpProvider.interceptors.push('authInterceptor');<% } %>
}
<% } %><% if(filters.auth) { %>
function authInterceptor($rootScope, $q, $cookieStore, $location) {
    return {
        // Add authorization token to headers
        request: function (config) {
            config.headers = config.headers || {};
            if ($cookieStore.get('token')) {
                config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
            }
            return config;
        },

        // Intercept 401s and redirect you to login
        responseError: function(response) {
            if (response.status === 401) {
                $location.path('/login');
                // Remove any stale tokens
                $cookieStore.remove('token');
                return $q.reject(response);
            } else {
                return $q.reject(response);
            }
        }
    };
}

function run($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on(<% if(filters.ngroute) { %>'$routeChangeStart'<% } %><% if(filters.uirouter) { %>'$stateChangeStart'<% } %>, onRouteChangeStart);

    function onRouteChangeStart(event, next) {
        Auth.isLoggedInAsync(function (loggedIn) {
            if (next.authenticate && !loggedIn) {
                event.preventDefault();
                $location.path('/login');
            }
        });
    }
}
<% } %>
})();
