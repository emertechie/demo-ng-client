(function() {
    'use strict';

    var module = angular.module('data', []);

    var STORAGE_PREFIX = 'com.emertechie.demoapp/';
    var TICKETS_DATA_KEY = STORAGE_PREFIX + 'data';

    module.run(function() {
        // Set up data in localstorage
        if (!localStorage) {
            throw 'No local storage available :(';
        }

        if (!localStorage[TICKETS_DATA_KEY]) {
            localStorage[TICKETS_DATA_KEY] = JSON.stringify(createDummyTicketData(100));
        }
    });

    module.factory('ticketsDataStore', function() {
        var MAX_PAGE_SIZE = 50;

        return {
            getPage: function(pageSize, page, order) {
                pageSize = pageSize || MAX_PAGE_SIZE;
                page = page || 1;

                var fakeData = JSON.parse(localStorage[TICKETS_DATA_KEY] || "[]");
                if (order) {
                    fakeData = sortData(fakeData, order);
                }

                var startIndex = pageSize * (page - 1);
                var pageData = [];
                var j = 0;
                for (var i = startIndex; i < fakeData.length; i++) {
                    pageData[j++] = fakeData[i];
                    if (j === pageSize) {
                        break;
                    }
                }

                var furthestItemVisible = pageSize * page;

                return {
                    pageNumber: page,
                    pageSize: pageSize,
                    pageData: pageData,
                    totalCount: fakeData.length,
                    hasPrevPage: page > 1,
                    hasNextPage: furthestItemVisible < fakeData.length
                };
            }
        };
    });

    function sortData(data, order) {
        var orderPropName;
        for (var prop in order) {
            if (order.hasOwnProperty(prop)) {
                orderPropName = prop;
                break;
            }
        }
        var sortedData = _.sortBy(data, orderPropName);
        if (order[orderPropName] === 'desc') {
            sortedData.reverse();
        }
        return sortedData;
    }

    function createDummyTicketData(count) {
        var tickets = [];
        for (var i = 1; i <= count; i++) {
            tickets.push({
                id: i,
                number: 'Ticket#' + i,
                status: 'open',
                title: 'Ticket ' + i,
                description: 'Description for ticket ' + i,
                assignedTo: null,
                created: Date.now(),
                updated: null
            });
        }
        return tickets;
    }
}());
