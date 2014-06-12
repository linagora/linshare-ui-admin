'use strict';

angular.module('linshareAdminApp')
  .controller('MailContentCtrl',
    ['$scope', '$log', 'Authentication', 'Domain', 'MailContent',
      function ($scope, $log, Authentication, Domain, MailContent) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentMailContent = function() {
          return MailContent.getCurrent();
        };
        $scope.reload = function() {
          Authentication.getCurrentUser().then(function(user) {
            Domain.setCurrent(undefined);
            MailContent.setCurrent(undefined);
            Domain.getDomainTree(user.domain, function(domainTree) {
              $scope.root = [domainTree];
            });
          });
        };
        $scope.reload();
      }
    ]
  );
