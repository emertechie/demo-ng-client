(function() {
    'use strict';

    var module = angular.module('authServices', ['config']);

    module.factory('authData', ['$window', function($window) {
        var storageArea = $window.sessionStorage;
        return {
            get: function() {
                if (storageArea.token && storageArea.email) {
                    return {
                        token: storageArea.token,
                        email: storageArea.email
                    };
                }
                return null;
            },
            set: function(token, email) {
                storageArea.token = token;
                storageArea.email = email;
            },
            remove: function() {
                delete storageArea.token;
                delete storageArea.email;
            }
        };
    }]);

    module.factory('authService', ['$q', '$http', 'authUrl', 'authData', function($q, $http, authUrl, authData) {
        return {
            login: function(email, password) {
                var deferred = $q.defer();

                $http.post(authUrl + '/login', {
                    email: email,
                    password: password
                }).success(function(token) {
                    authData.set(token, email);
                    deferred.resolve();
                }).error(function(data) {
                    authData.remove();
                    deferred.reject(data);
                });

                return deferred.promise;
            },
            logout: function() {
                var deferred = $q.defer();

                $http.get(authUrl + '/logout').success(function() {
                    authData.remove();
                    deferred.resolve();
                }).error(function(data) {
                    deferred.reject(data);
                });

                return deferred.promise;
            },
            isAuthenticated: function() {
                return !!authData.get();
            }
        };
    }]);

    // Hiding all this implementation details inside the IIFE
    var doLoginCallback;
    function loginRequired(requestedPath) {
        if (!doLoginCallback) {
            throw new Error('No login handler registered. Use authService.registerLoginHandler');
        }
        doLoginCallback(requestedPath);
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

    module.factory('authInterceptor', ['$rootScope', '$q', 'authData', function($rootScope, $q, authData) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                var data = authData.get();
                if (data) {
                    config.headers.Authorization = 'Bearer ' + data.token;
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

    module.run(['$rootScope', '$location', 'authService', function($rootScope, $location, authService) {
        $rootScope.$on('$routeChangeStart', function(event, next) {
            if (!next.$$route) {
                // In the middle of a redirect
                return;
            }
            if (next.$$route.needsAuthentication !== false && !authService.isAuthenticated()) {
                var path = $location.path();
                loginRequired(path);
            }
        });
    }]);
}());
