'use strict';

angular.module('myApp.controllers')
  .controller('DomainManagementCtrl',
    ['$scope', '$log', 'Domain',
      function ($scope, $log, Domain) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.needReload = false;
        $scope.reload = function() {
          $scope.needReload = true;
          Domain.setCurrent(undefined);
        };
      }
    ]
  );
