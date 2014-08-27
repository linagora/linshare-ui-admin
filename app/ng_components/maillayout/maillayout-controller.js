'use strict';

angular.module('linshareAdminApp')
  .controller('MailLayoutCtrl',
    ['$scope', '$log', 'Authentication', 'Domain', 'MailLayout',
      function ($scope, $log, Authentication, Domain, MailLayout) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentMailLayout = function() {
          return MailLayout.getCurrent();
        };
        $scope.reload = function() {
          Authentication.getCurrentUser().then(function(user) {
            Domain.setCurrent(undefined);
            MailLayout.setCurrent(undefined);
            Domain.getDomainTree(user.domain, function(domainTree) {
              $scope.root = [domainTree];
            });
          });
        };
        $scope.reload();
      }
    ]
  );
