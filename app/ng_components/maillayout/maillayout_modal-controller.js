'use strict';

angular.module('linshareAdminApp')
  .controller('mailLayoutModalCtrl',
    ['$scope', '$log', '$state', '$modalInstance', 'Domain', 'MailLayout',
      function ($scope, $log, $state, $modalInstance, Domain, MailLayout) {
        Domain.getAll().then(function(domains) {
          $scope.domains = domains;
          if (!_.isUndefined($scope.domainUuid)) {
            $scope.domain = _.find($scope.domains, {identifier: $scope.domainUuid});
          }
        });
        $scope.isDefined = function(x) {
          return !_.isUndefined(x);
        };
        $scope.reloadModels = function(domain) {
          if (!_.isUndefined($scope.domain)) {
            MailLayout.getAll(Domain.getId($scope.domain), false).then(function(models) {
              $scope.models = models;
              if (!_.isUndefined($scope.modelUuid)) {
                $scope.model = _.find($scope.models, {uuid: $scope.modelUuid});
              }
            });
          }
        };
        $scope.create = function (model) {
          var originalModel = model.originalElement;
          delete originalModel.description;
          angular.extend($scope.mailLayout, originalModel);
          delete $scope.mailLayout.uuid;
          delete $scope.mailLayout.creationDate;
          delete $scope.mailLayout.modificationDate;
          $scope.mailLayout.domain = $scope.domain.identifier;
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
        if (!_.isUndefined($scope.domain)) {
          $scope.reloadModels();
        }
      }
    ]
  );
