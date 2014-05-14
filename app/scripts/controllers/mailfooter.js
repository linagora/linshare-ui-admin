'use strict';

angular.module('linshareAdminApp')
  .controller('MailFooterCtrl',
    ['$scope', '$log', 'Domain', 'MailFooter',
      function ($scope, $log, Domain, MailFooter) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentMailFooter = function() {
          return MailFooter.getCurrent();
        };
        $scope.reload = function() {
          Domain.setCurrent(undefined);
          MailFooter.setCurrent(undefined);
          Domain.getDomainTree(function(domainTree) {
            $scope.root = [domainTree];
          });
        };
        $scope.reload();
      }
    ]
  );
