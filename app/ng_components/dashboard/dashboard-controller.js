'use strict';

angular.module('linshareAdminApp')
  .controller('DashbordCtrl',
     ['$scope', '$filter', '$log', 'authenticatedUser',
      function($scope, $filter, $log, authenticatedUser) {
        $scope.userDomain = authenticatedUser.domain;
      }
    ]);