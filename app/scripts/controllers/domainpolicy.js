'use strict';

angular.module('linshareAdminApp')
  .controller('DomainPolicyCtrl',
    ['$scope', '$log', 'DomainPolicy',
      function ($scope, $log, DomainPolicy) {
        $scope.getCurrentDomainPolicy = function() {
          return DomainPolicy.getCurrent();
        };
      }
    ]
  );
