'use strict';

angular.module('linshareUiAdmin')
  .controller('DomainPolicyCtrl',
    ['$scope', '$log', 'DomainPolicy',
      function ($scope, $log, DomainPolicy) {
        $scope.getCurrentDomainPolicy = function() {
          return DomainPolicy.getCurrent();
        };
      }
    ]
  );
