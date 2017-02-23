'use strict';

angular.module('linshareAdminApp')
  .controller('mailFooterModalCtrl',
    ['$modalInstance', '$log', '$scope', '$state', 'Domain', 'MailFooter',
      function ($modalInstance, $log, $scope, $state, Domain, MailFooter) {
        Domain.getAll().then(function(domains) {
          $scope.domains = domains;
          if (!_.isUndefined($scope.domainUuid)) {
            $scope.domain = _.find($scope.domains, {identifier: $scope.domainUuid});
          }
        });
        $scope.isDefined = function(x) {
          return !_.isUndefined(x);
        };
        $scope.reloadModels = function(lang, domain) {
          if (!_.isUndefined($scope.domain)) {
            MailFooter.getAll($scope.domain.identifier, false).then(function(models) {
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
          _.extend($scope.mailFooter, originalModel);
          delete $scope.mailFooter.uuid;
          delete $scope.mailFooter.creationDate;
          delete $scope.mailFooter.modificationDate;
          $scope.mailFooter.domain = $scope.domain.identifier;
          MailFooter.add($scope.mailFooter).then(function() {
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
          $scope.mailFooter = {};
        };
        if (!_.isUndefined($scope.domain)) {
          $scope.reloadModels();
        }
      }
    ]
  );
