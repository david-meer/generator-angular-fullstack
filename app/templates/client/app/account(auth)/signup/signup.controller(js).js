(function() {

'use strict';

angular
    .module('<%= scriptAppName %>')
    .controller('SignupController', SignupController);

SignupController.$inject = ['$scope', '$location'<% if (filters.oauth) { %>, '$window'<% } %>, 'Auth'];

function SignupController($scope, $location<% if (filters.oauth) { %>, $window<% } %>, Auth) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function (form) {
        $scope.submitted = true;

        if (form.$valid) {
            Auth
                .createUser({
                    name: $scope.user.name,
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                .then(function() {
                    // Account created, redirect to home
                    $location.path('/');
                })
                .catch(function(err) {
                    err = err.data;
                    $scope.errors = {};

                    // Update validity of form fields that match the mongoose errors
                    angular.forEach(err.errors, function(error, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.message;
                    });
                });
        }
    };
<% if(filters.oauth) {%>
    $scope.loginOauth = function (provider) {
        $window.location.href = '/auth/' + provider;
    };<% } %>
}

})();
