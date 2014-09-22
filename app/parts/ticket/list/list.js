(function() {
    'use strict';

    var module = angular.module('ticketList', ['data', 'ngRoute', 'ui.bootstrap']);

    module.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/tickets', {
            templateUrl: 'parts/ticket/list/list.html',
            controller: 'TicketListCtrl'
        });
    }]);

    module.controller('TicketListCtrl', ['$scope', 'ticketsDataStore', function($scope, ticketsDataStore) {
        var PAGE_SIZE = 10;

        $scope.pageNumber = 1;
        $scope.order = { 'title': 'asc' };

        $scope.$watch('pageNumber', function(pageNumber) {
            loadData(pageNumber, $scope.order);
        });

        $scope.orderBy = function(orderProp) {
            loadData($scope.pageNumber, getNewOrder($scope.order, orderProp));
        };

        function loadData(pageNumber, order) {
            $scope.page = ticketsDataStore.getPage(PAGE_SIZE, pageNumber, order);
            $scope.pageNumber = pageNumber;
            $scope.order = order;
        }

        function getNewOrder(orderObj, orderProp) {
            var existing = (orderObj || {})[orderProp];
            var newOrderObj = {};
            newOrderObj[orderProp] = (existing === 'asc' ? 'desc' : 'asc');
            return newOrderObj;
        }
    }]);
}());
