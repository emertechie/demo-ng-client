(function() {
    'use strict';

    var module = angular.module('ticketEdit', ['data', 'ngRoute', 'validation']);

    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/ticket/:number', {
            templateUrl: 'parts/ticket/edit/edit.html',
            controller: 'TicketCtrl'
        });
    }]);

    module.controller('TicketCtrl', ['$scope', '$routeParams', 'ticketsDataStore', function($scope, $routeParams, ticketsDataStore) {
        ticketsDataStore.get($routeParams.number)
            .then(function(ticket) {
                $scope.ticket = ticket;
            }, function(err) {
                // todo: error handling
            });

        $scope.save = function() {
            if (!$scope.form.$valid) {
                console.log('Not valid');


                return;
            }

            console.log('Saving');

            ticketsDataStore.update($scope.ticket)
                .then(function(updated) {
                    if (updated) {
                        // todo: show success message
                        // todo: navigate back ?
                    } else {
                        // todo: show error message
                    }
                }, function(err) {
                    // todo: show safe error message
                });
        };
    }]);
}());
