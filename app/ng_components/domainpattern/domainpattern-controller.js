'use strict';

angular.module('linshareAdminApp')
  .controller('DomainPatternCtrl',
    ['$scope', '$log', 'DomainPattern',
      function ($scope, $log, DomainPattern) {
        $scope.getCurrentDomainPattern = function() {
          return DomainPattern.getCurrent();
        };
      }
    ]
  );
