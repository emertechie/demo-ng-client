(function() {
    'use strict';

    var module = angular.module('login', ['authServices', 'validation']);

    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'parts/auth/login/login.html',
            controller: 'LoginCtrl',
            needsAuthentication: false
        });
    }]);

    module.run(['authConfig', '$location', function(authConfig, $location) {
        authConfig.registerLoginHandler(function() {
            $location.path('/login');
        });
    }]);

    module.controller('AuthCtrl', ['$scope', '$location', 'authData', 'authService', 'messages', function($scope, $location, authData, authService, messages) {
        $scope.user = {};

        $scope.$watch(function() {
            var data = authData.get();
            return data ? data.email : null;
        }, function(email) {
            $scope.user.email = email;
        });

        $scope.logout = function() {
            authService.logout().then(function() {
                $location.path('/');
                messages.success('Logged out');
            }, function(err) {
                messages.error(err);
            });
        };
    }]);

    module.controller('LoginCtrl', ['$scope', '$location', '$window', 'authService', 'messages', function($scope, $location, $window, authService, messages) {
        $scope.model = {
            // Just for testing obviously
            email: 'foo@example.com',
            password: '12345'
        };

        $scope.login = function() {
            if (!$scope.form.$valid) {
                return;
            }

            $scope.loggingIn = true;
            authService.login($scope.model.email, $scope.model.password).then(function() {
                $location.path('/');
                messages.success('Logged in');
            }, function(err) {
                messages.error(err);
            }).finally(function() {
                $scope.loggingIn = false;
            });
        };
    }]);
}());
