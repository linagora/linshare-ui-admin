'use strict';

// https://github.com/realcrowd/angularjs-utilities

angular.module('linshareUiAdmin').directive('lsFormAttempt', [
  function() {
    return {
      restrict: 'A',
      controller: ['$scope',
        function($scope) {
          this.attempted = false;
          var attemptHandlers = [];
          this.onAttempt = function(handler) {
            attemptHandlers.push(handler);
          };
          this.setAttempted = function() {
            this.attempted = true;
            angular.forEach(attemptHandlers, function(handler) {
              handler();
            });
          };
        }
      ],
      compile: function(cElement, cAttributes, transclude) {
        return {
          pre: function(scope, formElement, attributes, attemptController) {
            scope.ls = scope.ls || {};
            scope.ls[attributes.name] = attemptController;
          },
          post: function(scope, formElement, attributes, attemptController) {
            formElement.bind('submit', function() {
              attemptController.setAttempted();
              if (!scope.$$phase) scope.$apply();
            });
          }
        };
      }
    };
  }
]);
