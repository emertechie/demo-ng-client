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
                        scope.$broadcast('validation-ui.form-submitted', formCtrl);
                    });
                });
            }
        };
    });

    module.directive('validationUiGroup', function() {
        return {
            restrict: 'A',
            controller: function() {
                this.callbacks = [];

                this.onModelChanged = function(callback) {
                    this.callbacks.push(callback);
                }.bind(this);

                this.modelChanged = function(ngModel) {
                    _.each(this.callbacks, function(callback) {
                        callback(ngModel.$valid, ngModel);
                    });
                }.bind(this);
            },
            link: function(scope, el, attrs, ctrl) {
                var formSubmittedFlag;
                var valid;

                ctrl.onModelChanged(function(isValid, ngModel) {
                    valid = isValid;
                    showGroupError(!isValid && (formSubmittedFlag || ngModel.$blurred));
                });

                scope.$on('validation-ui.form-submitted', function(e, form) {
                    formSubmittedFlag = true;
                    showGroupError(!valid);
                });

                function showGroupError(show) {
                    if (show) {
                        el.addClass('has-error');
                    } else {
                        el.removeClass('has-error');
                    }
                }
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
                    validationUiGroup.modelChanged(ngModel);
                });

                el.on('blur', function() {
                    ngModel.$blurred = true;
                    validationUiGroup.modelChanged(ngModel);
                });

                el.on('focus', function() {
                    ngModel.$blurred = false;
                    validationUiGroup.modelChanged(ngModel);
                });
            }
        };
    });

    module.directive('validationUiError', function() {
        return {
            restrict: 'A',
            require: '^validationUiGroup',
            link: function(scope, el, attrs, validationUiGroup) {

                var showReason = attrs.validationUiError || 'required';

                var formSubmittedFlag;
                var isValid;
                var modelCtrl;

                scope.$on('validation-ui.form-submitted', function(e, form) {
                    // Note: Don't set flag on a successful form submit
                    if (!isValid) {
                        formSubmittedFlag = true;
                    }

                    var controlsWithError = form.$error[showReason] || [];
                    var shouldShowError = controlsWithError.indexOf(modelCtrl) !== -1;
                    updateVisibility(shouldShowError);
                });

                validationUiGroup.onModelChanged(function(valid, ngModel) {
                    isValid = valid;
                    modelCtrl = ngModel;

                    if (valid) {
                        // reset until next submit
                        formSubmittedFlag = false;
                    }

                    var invalidBecauseOfThisError = ngModel.$error[showReason];

                    updateVisibility(formSubmittedFlag && !valid && invalidBecauseOfThisError);
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
