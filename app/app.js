(function() {
    'use strict';

    var app = angular.module('demoApp', [
        'ngRoute',
        'messages',
        'auth',
        'ticket',
        'utils',
        'wrappers'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/tickets'
        });
    }]);
}());
