(function() {
    'use strict';

    var app = angular.module('demoApp', [
        'ngRoute',
        'ticket'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/tickets'
        });
    }]);
}());
