'use strict';

angular.module('linshareAdminApp')
  .controller('MailLayoutCtrl',
    ['$scope', '$log', 'Domain', 'MailLayout',
      function ($scope, $log, Domain, MailLayout) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentMailLayout = function() {
          return MailLayout.getCurrent();
        };
        $scope.reload = function() {
          Domain.setCurrent(undefined);
          MailLayout.setCurrent(undefined);
          Domain.getDomainTree(function(domainTree) {
            $scope.root = [domainTree];
          });
        };
        $scope.reload();
      }
    ]
  );
