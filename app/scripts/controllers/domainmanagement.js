'use strict';

angular.module('linshareAdminApp')
  .controller('DomainManagementCtrl',
    ['$scope', '$log', 'Authentication', 'Domain',
      function ($scope, $log, Authentication, Domain) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.reload = function() {
          Authentication.getCurrentUser().then(function(user) {
            Domain.setCurrent(undefined);
            Domain.getDomainTree(user.domain, function(domainTree) {
              $scope.root = [domainTree];
            });
          });
        };
        $scope.reload();
      }
    ]
  );
