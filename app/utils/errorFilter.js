(function() {
    'use strict';

    var module = angular.module('utils', []);

    module.filter('error', function(_) {
        return function(err) {
            if (!err) {
                return [];
            }

            // Assume it's an array of validation errors as returned from https://github.com/ctavan/express-validator
            return (typeof err === 'string')
                ? [ err ]
                : _.pluck(err, 'msg');
        };
    });
}());
