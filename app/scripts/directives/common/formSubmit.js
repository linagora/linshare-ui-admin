'use strict';

// https://github.com/realcrowd/angularjs-utilities

angular.module('linshareAdminApp').directive('lsFormSubmit', ['$parse',
  function($parse) {
    return {
      restrict: 'A',
      require: 'form',
      link: function(scope, formElement, attributes, formController) {
        var fn = $parse(attributes.lsFormSubmit);
        formElement.bind('submit', function(event) {
          // if form is not valid cancel it.
          if (!formController.$valid) return false;

          scope.$apply(function() {
            fn(scope, {
              $event: event
            });
          });
        });
      }
    };
  }
]);
