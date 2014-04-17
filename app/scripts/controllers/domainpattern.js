'use strict';

angular.module('linshareUiAdmin')
  .controller('DomainPatternCtrl',
    ['$scope', '$log', 'DomainPattern',
      function ($scope, $log, DomainPattern) {
        $scope.getCurrentDomainPattern = function() {
          return DomainPattern.getCurrent();
        };
      }
    ]
  );
