(function() {
    'use strict';

    var module = angular.module('ticketEdit', ['data', 'ngRoute', 'validation']);

    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/ticket', {
            templateUrl: 'parts/ticket/edit/edit.html',
            controller: 'TicketCtrl'
        });
        $routeProvider.when('/ticket/:number', {
            templateUrl: 'parts/ticket/edit/edit.html',
            controller: 'TicketCtrl'
        });
    }]);

    module.controller('TicketCtrl', ['$scope', '$routeParams', '$location', 'ticketsDataStore', function($scope, $routeParams, $location, ticketsDataStore) {
        $scope.isNewTicket = !$routeParams.number;

        if ($routeParams.number) {
            ticketsDataStore.get($routeParams.number)
                .then(function(ticket) {
                    $scope.ticket = ticket;
                }, function(err) {
                    // todo: error handling
                });
        } else {
            $scope.ticket = ticketsDataStore.create();
        }

        $scope.save = function() {
            if (!$scope.form.$valid) {
                return;
            }

            if ($scope.isNewTicket) {
                ticketsDataStore.add($scope.ticket)
                    .then(function(added) {
                        if (added) {
                            var newPath = $location.path() + '/' + added.number;
                            $location.path(newPath);
                        } else {
                            // todo: show error message
                        }
                    }, function(err) {
                        // todo: show safe error message
                    });
            } else {
                ticketsDataStore.update($scope.ticket)
                    .then(function(updated) {
                        if (updated) {
                            $scope.ticket = updated;
                            // todo: show success message
                        } else {
                            // todo: show error message
                        }
                    }, function(err) {
                        // todo: show safe error message
                    });
            }
        };
    }]);
}());
