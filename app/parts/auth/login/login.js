(function() {
    'use strict';

    var module = angular.module('login', ['authServices', 'validation']);

    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'parts/auth/login/login.html',
            controller: 'LoginCtrl'
        });
    }]);

    module.run(['authConfig', '$location', function(authConfig, $location) {
        authConfig.registerLoginHandler(function() {
            $location.path('/login');
        });
    }]);

    module.controller('LoginCtrl', ['$scope', 'authService', '$location', 'messages', function($scope, authService, $location, messages) {
        $scope.model = {};

        $scope.login = function() {
            if (!$scope.form.$valid) {
                return;
            }
            
            authService.login($scope.model.email, $scope.model.password).then(function() {
                $location.path('/');
                messages.success('Logged in');
            }, function(err) {
                messages.error(err);
            });
        };

        $scope.logout = function() {
            authService.logout().then(function() {
                $location.path('/');
                messages.success('Logged out');
            }, function(err) {
                messages.error(err);
            });
        };
    }]);
}());
