'use strict';

angular.module('myApp.controllers')
  .controller('DomainManagementCtrl',
    ['$scope', '$log', 'Domain',
      function ($scope, $log, Domain) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.reload = function() {
          Domain.setCurrent(undefined);
        };
        $scope.reload();
      }
    ]
  );
