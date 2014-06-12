'use strict';

angular.module('linshareAdminApp')
  .controller('FunctionalityManagementCtrl',
    ['$scope', '$log', 'Authentication', 'Domain', 'Functionality',
      function ($scope, $log, Authentication, Domain, Functionality) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.getCurrentFunctionality = function() {
          return Functionality.getCurrent();
        };
        $scope.reload = function() {
          Authentication.getCurrentUser().then(function(user) {
            Domain.setCurrent(undefined);
            Functionality.setCurrent(undefined);
            Domain.getDomainTree(user.domain, function(domainTree) {
              $scope.root = [domainTree];
            });
          });
        };
        $scope.reload();
      }
    ]
  );
