'use strict';

angular.module('myApp.controllers')
  .controller('FunctionalityManagementCtrl',
    ['$scope', '$log', 'Domain',
      function ($scope, $log, Domain) {
        $scope.getCurrentDomain = function() {
          return Domain.getCurrent();
        };
        $scope.reload = function() {
          Domain.setCurrent(undefined);
          Domain.getDomainTree(function(domainTree) {
            $scope.root = [domainTree];
          });
        };
        $scope.reload();
      }
    ]
  );