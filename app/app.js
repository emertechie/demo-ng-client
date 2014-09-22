(function() {
    'use strict';

    var app = angular.module('demoApp', [
        'ngRoute',
        'ticketList'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/tickets'
        });
    }]);
}());
