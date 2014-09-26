(function() {
    'use strict';

    var module = angular.module('authServices', ['config']);

    module.factory('authService', ['authUrl', '$window', '$q', '$http', function(authUrl, $window, $q, $http) {
        return {
            login: function(email, password) {
                var deferred = $q.defer();

                $http.post(authUrl + '/login', {
                    email: email,
                    password: password
                }).success(function(data) {
                    $window.sessionStorage.token = data;
                    $q.resolve();
                }).error(function(data) {
                    delete $window.sessionStorage.token;
                    $q.reject(data);
                });

                return deferred.promise;
            },
            logout: function() {
                var deferred = $q.defer();

                $http.post(authUrl + '/logout').success(function() {
                    delete $window.sessionStorage.token;
                    $q.resolve();
                }).error(function(data) {
                    $q.reject(data);
                });

                return deferred.promise;
            },
            isAuthenticated: function() {
                return !!$window.sessionStorage.token;
            }
        };
    }]);

    // Hiding all this implementation details inside the IIFE
    var doLoginCallback;
    function loginRequired() {
        if (!doLoginCallback) {
            throw new Error('No login handler registered. Use authService.registerLoginHandler');
        }
        doLoginCallback();
    }

    // Using ng service rather than a provider to allow for injection of run-time services like $location at usage point
    module.factory('authConfig', function() {
        return {
            // Note: I prefer explicit service methods over listening for an event on $rootScope
            registerLoginHandler: function(callback) {
                doLoginCallback = callback;
            }
        };
    });

    module.factory('authInterceptor', ['$rootScope', '$q', '$window', function($rootScope, $q, $window) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    loginRequired();
                }
                return response || $q.when(response);
            }
        };
    }]);

    module.config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }]);
}());
