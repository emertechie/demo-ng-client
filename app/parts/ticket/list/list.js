(function() {
    'use strict';

    var module = angular.module('ticketList', ['ngRoute', 'ui.bootstrap']);

    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/tickets', {
            templateUrl: 'parts/ticket/list/list.html',
            controller: 'TicketListCtrl'
        });
    }]);

    module.controller('TicketListCtrl', ['$scope', 'ticketsDataStore', function($scope, ticketsDataStore) {
        var PAGE_SIZE = 10;

        // This gets updated by the pager control:
        $scope.pageNumber = 1;

        $scope.$watch('pageNumber', function(pageNumber) {
            $scope.page = ticketsDataStore.getPage(PAGE_SIZE, pageNumber);
            $scope.pageNumber = $scope.page.pageNumber;
        });
    }]);

    module.factory('ticketsDataStore', function() {
        var MAX_PAGE_SIZE = 50;

        return {
            getPage: function(pageSize, page) {
                pageSize = pageSize || MAX_PAGE_SIZE;
                page = page || 1;

                var startIndex = pageSize * (page - 1);

                // Set up some dummy data:
                var totalCount = 80;
                var tickets = createDummyData(startIndex, pageSize, totalCount);

                var furthestItemVisible = pageSize * page;

                var pageData = {
                    pageNumber: page,
                    pageSize: pageSize,
                    pageData: tickets,
                    totalCount: totalCount,
                    hasPrevPage: page > 1,
                    hasNextPage: furthestItemVisible < totalCount
                };
                console.log('pageData', pageData);
                return pageData;
            }
        };
    });

    function createDummyData(startIndex, pageSize, totalCount) {
        var count = 0;
        var tickets = [];
        for (var i = startIndex; i < totalCount; i++) {
            var number = i + 1;

            tickets.push({
                id: i,
                number: 'Ticket#' + number,
                status: 'open',
                title: 'Ticket ' + number,
                description: 'Description for ticket ' + number,
                assignedTo: null,
                created: Date.now(),
                updated: null
            });

            if (++count === pageSize) {
                break;
            }
        }
        return tickets;
    }
}());
