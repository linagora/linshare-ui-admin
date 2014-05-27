'use strict';

angular.module('linshareAdminApp')
  .controller('MimePolicyCtrl',
    ['$scope', '$log', 'Domain', 'MimePolicy',
      function ($scope, $log, Domain, MimePolicy) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentMimePolicy = function() {
          return MimePolicy.getCurrent();
        };
        $scope.reload = function() {
          Domain.setCurrent(undefined);
          MimePolicy.setCurrent(undefined);
          Domain.getDomainTree(function(domainTree) {
            $scope.root = [domainTree];
          });
        };
        $scope.reload();
      }
    ]
  );
