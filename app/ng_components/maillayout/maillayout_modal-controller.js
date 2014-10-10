'use strict';

angular.module('linshareAdminApp')
  .controller('mailLayoutModalCtrl',
    ['$scope', '$log', '$state', '$modalInstance', 'Domain', 'MailLayout',
      function ($scope, $log, $state, $modalInstance, Domain, MailLayout) {
        Domain.getAll().then(function(domains) {
          $scope.domains = domains;
        });
        $scope.isDefined = function(x) {
          return angular.isDefined(x);
        };
        $scope.reloadModels = function(domain) {
          if (angular.isDefined(domain)) {
            MailLayout.getAll(Domain.getId(domain), false).then(function(models) {
              $scope.models = models;
            });
          }
        };
        $scope.create = function (model) {
          var originalModel = model.originalElement;
          delete originalModel.name;
          angular.extend($scope.mailLayout, originalModel);
          delete $scope.mailLayout.uuid;
          delete $scope.mailLayout.creationDate;
          delete $scope.mailLayout.modificationDate;
          $scope.mailLayout.domain = $state.params.domainId;
          MailLayout.add($scope.mailLayout).then(function() {
            $modalInstance.close();
            $scope.reset();
            $state.reinit();
          });
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
          $scope.reset();
        };
        $scope.reset = function() {
          $scope.mailLayout = {};
        };
        $scope.reset();
      }
    ]
  );
