'use strict';

angular.module('myApp.controllers')
  .controller('DomainPatternCtrl',
    ['$scope', '$log', 'DomainPattern',
      function ($scope, $log, DomainPattern) {
        $scope.getCurrentDomainPattern = function() {
          return DomainPattern.getCurrent();
        };
      }
    ]
  );
