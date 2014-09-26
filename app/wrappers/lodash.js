(function() {
    'use strict';

    var module = angular.module('wrappers', []);

    // Seems a bit redundant, but it makes the dependency explicit when injecting into elsewhere
    module.factory('_', function() {
        return _;
    });
}());
