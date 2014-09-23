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
        if ($routeParams.number) {
            ticketsDataStore.get($routeParams.number)
                .then(function(ticket) {
                    $scope.ticket = ticket;
                }, function(err) {
                    // todo: error handling
                });
        }

        $scope.save = function() {
            if (!$scope.form.$valid) {
                return;
            }

            if ($scope.ticket.number) {
                ticketsDataStore.update($scope.ticket)
                    .then(function(updated) {
                        if (updated) {
                            $scope.ticket = updated;
                            // todo: show success message
                            // todo: navigate back ?
                        } else {
                            // todo: show error message
                        }
                    }, function(err) {
                        // todo: show safe error message
                    });
            } else {
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
            }
        };
    }]);
}());
