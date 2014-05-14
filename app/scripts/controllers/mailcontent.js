'use strict';

angular.module('linshareAdminApp')
  .controller('MailContentCtrl',
    ['$scope', '$log', 'Domain', 'MailContent',
      function ($scope, $log, Domain, MailContent) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentMailContent = function() {
          return MailContent.getCurrent();
        };
        $scope.reload = function() {
          Domain.setCurrent(undefined);
          MailContent.setCurrent(undefined);
          Domain.getDomainTree(function(domainTree) {
            $scope.root = [domainTree];
          });
        };
        $scope.reload();
      }
    ]
  );
