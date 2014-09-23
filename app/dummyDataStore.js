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
            setFakeData(TICKETS_DATA_KEY, createDummyTicketData(100));
        }
    });

    module.factory('ticketsDataStore', ['$timeout', '$q', function($timeout, $q) {
        var MAX_PAGE_SIZE = 50;

        return {
            get: function(ticketNumber) {
                var fakeData = getFakeData(TICKETS_DATA_KEY);
                var ticket = _.find(fakeData, function(item) {
                    return item.number === ticketNumber;
                });
                return simulateDelay(ticket);
            },
            add: function(ticket) {
                if (ticket.number) {
                    throw new Error('Attempted to add an existing ticket');
                }
                var fakeData = getFakeData(TICKETS_DATA_KEY);
                ticket.number = generateTicketNumber(fakeData.length);
                fakeData.push(ticket);
                setFakeData(TICKETS_DATA_KEY, fakeData);
                return simulateDelay(ticket);

            },
            update: function(ticket) {
                var fakeData = getFakeData(TICKETS_DATA_KEY);
                var existingIndex = _.findIndex(fakeData, function(item) {
                    return item.number === ticket.number;
                });
                var updated = null;
                if (existingIndex !== -1) {
                    updated = _.clone(ticket);
                    updated.updated = Date.now();
                    fakeData[existingIndex] = updated;
                    setFakeData(TICKETS_DATA_KEY, fakeData);
                }
                return simulateDelay(updated);
            },
            getPage: function(pageSize, page, order) {
                pageSize = pageSize || MAX_PAGE_SIZE;
                page = page || 1;

                var fakeData = getFakeData(TICKETS_DATA_KEY);
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

                return simulateDelay({
                    pageNumber: page,
                    pageSize: pageSize,
                    pageData: pageData,
                    totalCount: fakeData.length,
                    hasPrevPage: page > 1,
                    hasNextPage: furthestItemVisible < fakeData.length
                });
            }
        };

        function simulateDelay(result) {
            var deferred = $q.defer();
            $timeout(function() {
                deferred.resolve(result);
            }, 100);
            return deferred.promise;
        }
    }]);

    function getFakeData(key) {
        return JSON.parse(localStorage[key] || "[]");
    }

    function setFakeData(key, data) {
        localStorage[key] = JSON.stringify(data);
    }

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
                number: generateTicketNumber(i),
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

    function generateTicketNumber(i) {
        var pad = '000';
        var padded = (pad + i).substr(-pad.length);
        return 'tkt-' + padded;
    }
}());
