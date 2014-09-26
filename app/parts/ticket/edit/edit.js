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

    module.controller('TicketCtrl', ['$scope', '$routeParams', '$location', '$window', 'ticketsDataStore', 'messages', function($scope, $routeParams, $location, $window, ticketsDataStore, messages) {
        $scope.isNewTicket = !$routeParams.number;

        if ($routeParams.number) {
            ticketsDataStore.get($routeParams.number)
                .then(function(ticket) {
                    $scope.ticket = ticket;
                }, function(err) {
                    messages.error(err);
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
                        var newPath = $location.path() + '/' + added.number;
                        $location.path(newPath);
                        messages.success('Added ticket');
                    }, function(err) {
                        messages.error(err);
                    });
            } else {
                ticketsDataStore.update($scope.ticket)
                    .then(function(updated) {
                        $scope.ticket = updated;
                        $window.history.back();
                        messages.success('Updated ticket');
                    }, function(err) {
                        messages.error(err);
                    });
            }
        };
    }]);
}());
