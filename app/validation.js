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
            scope: true,
            controller: function() {
                this.callbacks = [];

                this.onValidityChanged = function(callback) {
                    this.callbacks.push(callback);
                }.bind(this);

                this.modelValidityChanged = function(ngModel) {
                    _.each(this.callbacks, function(callback) {
                        callback(ngModel.$valid, ngModel);
                    });
                }.bind(this);
            },
            link: function(scope, el, attrs, ctrl) {
                ctrl.onValidityChanged(function(isValid, ngModel) {
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

                    var controls = form.$error[showReason] || [];
                    var shouldShowError = controls.indexOf(modelCtrl) !== -1;
                    updateVisibility(shouldShowError);
                });

                validationUiGroup.onValidityChanged(function(valid, ngModel) {
                    isValid = valid;
                    modelCtrl = ngModel;

                    if (valid) {
                        // reset until next submit
                        formSubmittedFlag = false;
                    }

                    updateVisibility(formSubmittedFlag && valid === false);
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
