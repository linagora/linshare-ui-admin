'use strict';

angular.module('linshareAdminApp')
  .controller('MailFooterCtrl',
    ['$scope', '$log', 'Authentication', 'Domain', 'MailFooter',
      function ($scope, $log, Authentication, Domain, MailFooter) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentMailFooter = function() {
          return MailFooter.getCurrent();
        };
        $scope.reload = function() {
          Authentication.getCurrentUser().then(function(user) {
            Domain.setCurrent(undefined);
            MailFooter.setCurrent(undefined);
            Domain.getDomainTree(user.domain, function(domainTree) {
              $scope.root = [domainTree];
            });
          });
        };
        $scope.reload();
      }
    ]
  );
