'use strict';

angular.module('linshareAdminApp')
  .controller('MimePolicyCtrl',
    ['$scope', '$log', 'Authentication', 'Domain', 'MimePolicy',
      function ($scope, $log, Authentication, Domain, MimePolicy) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentMimePolicy = function() {
          return MimePolicy.getCurrent();
        };
        $scope.reload = function() {
          Authentication.getCurrentUser().then(function(user) {
            Domain.setCurrent(undefined);
            MimePolicy.setCurrent(undefined);
            Domain.getDomainTree(user.domain, function(domainTree) {
              $scope.root = [domainTree];
            });
          });
        };
        $scope.reload();
      }
    ]
  );
