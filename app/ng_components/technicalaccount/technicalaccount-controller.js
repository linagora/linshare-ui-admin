'use strict';

angular.module('linshareAdminApp')
  .controller('TechnicalAccountCtrl',
    ['$scope', '$log', 'TechnicalAccount',
      function ($scope, $log, TechnicalAccount) {
        $scope.getCurrentAccount = function() {
          return TechnicalAccount.getCurrent();
        };
      }
    ]
  );
