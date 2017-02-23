'use strict';

angular.module('linshareAdminApp')
  .controller('mailConfigModalCtrl',
    ['$modalInstance', '$log', '$scope', '$state', 'Domain', 'MailConfig',
      function ($modalInstance, $log, $scope, $state, Domain, MailConfig) {
        Domain.getAll().then(function(domains) {
          $scope.domains = domains;
          if (!_.isUndefined($scope.domainUuid)) {
            $scope.domain = _.find($scope.domains, function(domain) {
                return domain.identifier === $scope.domainUuid;
              });
          }
        });
        $scope.isDefined = function(x) {
          return !_.isUndefined(x);
        };
        $scope.reloadModels = function(lang, domain) {
          if (angular.isDefined($scope.domain)) {
            MailConfig.getAll($scope.domain.identifier, false).then(function(models) {
              $scope.models = models;
              if (!_.isUndefined($scope.modelUuid)) {
                $scope.model = _.find($scope.models, function(model) {
                  return model.uuid === $scope.modelUuid;
                });
              }
            });
          }
        };
        $scope.create = function (model) {
          var originalModel = model.originalElement;
          delete originalModel.name;
          angular.extend($scope.mailConfig, originalModel);
          delete $scope.mailConfig.uuid;
          delete $scope.mailConfig.creationDate;
          delete $scope.mailConfig.modificationDate;
          $scope.mailConfig.domain = $scope.domain.identifier;
          MailConfig.add($scope.mailConfig).then(function() {
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
          $scope.mailConfig = {};
        };
        if (!_.isUndefined($scope.domain)) {
          $scope.reloadModels();
        }
      }
    ]
  );
