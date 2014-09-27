(function() {
    'use strict';

    var module = angular.module('messages', ['ngAnimate']);

    module.factory('messages', function($timeout) {
        return {
            success: function(msg, timeout) {
                this.successObj = msg;
                $timeout(function() {
                    this.successObj = null;
                }.bind(this), timeout || 2000);
            },
            error: function(error, timeout) {
                this.errorObj = error;
                if (timeout) {
                    $timeout(function() {
                        this.errorObj = null;
                    }.bind(this), timeout);
                }
            },
            clear: function() {
                this.successObj = null;
                this.errorObj = null;
            }
        };
    });

    module.controller('MessageCtrl', ['$scope', 'messages', function($scope, messages) {
        $scope.$watch(function() {
            return messages.successObj;
        }, function(success) {
            $scope.success = success;
        });

        $scope.$watch(function() {
            return messages.errorObj;
        }, function(error) {
            $scope.error = error;
        });

        $scope.clear = function() {
            messages.clear();
        };
    }]);
}());