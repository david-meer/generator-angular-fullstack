(function() {

'use strict';

angular
    .module('<%= scriptAppName %>')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$location'<% if (filters.oauth) { %>, '$window'<% } %>, 'Auth'];

function LoginController($scope, $location<% if (filters.oauth) { %>, $window<% } %>, Auth) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function (form) {
        $scope.submitted = true;

        if (form.$valid) {
            Auth
                .login({
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                .then(function() {
                    // Logged in, redirect to home
                    $location.path('/');
                })
                .catch(function(err) {
                    $scope.errors.other = err.message;
                });
        }
    };
<% if(filters.oauth) {%>
    $scope.loginOauth = function (provider) {
        $window.location.href = '/auth/' + provider;
    };<% } %>
}

})();
