(function() {
    'use strict';

    var module = angular.module('validation', []);

    module.directive('validationUiForm', function() {
        return {
            restrict: 'A',
            require: 'form',
            link: function(scope, el, attr, formCtrl) {

                formCtrl.$submitted = false;

                el.on('submit', function() {
                    scope.$apply(function() {
                        formCtrl.$submitted = true;
                        scope.$broadcast('validation-ui.form-submitted');
                    });
                });
            }
        };
    });

    module.directive('validationUiGroup', function() {
        return {
            restrict: 'A',
            controller: ['$scope', function($scope) {
                this.modelValidityChanged = function(ngModel) {
                    $scope.$broadcast('validation-ui.change', ngModel.$valid, ngModel);
                };
            }],
            link: function(scope, el) {
                scope.$on('validation-ui.change', function(e, isValid, ngModel) {

                    var showGroupError = !isValid /* && ngModel.blurred &&*/;

                    if (showGroupError) {
                        el.addClass('has-error');
                    } else {
                        el.removeClass('has-error');
                    }
                });
            }
        };
    });

     module.directive('validationUiModel', function() {
        return {
            restrict: 'A',
            require: ['ngModel', '^validationUiGroup'],
            link: function(scope, el, attrs, controllers) {

                var ngModel = controllers[0];
                var validationUiGroup = controllers[1];

                scope.$watch(function() {
                    return ngModel.$valid;
                }, function() {
                    validationUiGroup.modelValidityChanged(ngModel);
                });


            }
        };
    });

    module.directive('validationUiError', function() {
        return {
            restrict: 'A',
            link: function(scope, el) {

                var formSubmitFlag = false;
                var valid;

                scope.$on('validation-ui.form-submitted', function() {
                    formSubmitFlag = true;
                    updateVisibility(valid === false);
                });

                scope.$on('validation-ui.change', function(e, isValid) {
                    valid = isValid;

                    if (isValid === true) {
                        formSubmitFlag = false;
                    }

                    updateVisibility(!isValid && formSubmitFlag);
                });

                function updateVisibility(shouldShow) {
                    if (shouldShow) {
                        el.show();
                    } else {
                        el.hide();
                    }
                }
            }
        };
    });
}());
