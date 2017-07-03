'use strict';

angular.module('linshareAdminApp')
  .controller('mailContentModalCtrl',
    ['_', '$scope', '$log', '$translate', '$state', '$modalInstance', 'Domain', 'Enum', 'mailContentRestService',
      function(_, $scope, $log, $translate, $state, $modalInstance, Domain, Enum, mailContentRestService) {


        Enum.getOptions('mail_content_type').then(function(options) {
          $scope.mailContentTypes = options;
        });
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
        $scope.reloadModels = function() {
          if (!_.isUndefined($scope.domain) &&
              !_.isUndefined($scope.mailContentType)) {
            mailContentRestService.getAll(Domain.getId($scope.domain), false).then(function(models) {
              $scope.models = models;
              if (!_.isUndefined($scope.modelUuid)) {
                $scope.model = _.find($scope.models, function(model) {
                  return model.uuid === $scope.modelUuid;
                });
              }
            });
          }
        };
        $scope.create = function(model) {
          var originalModel = model.originalElement;
          delete originalModel.description;
          angular.extend($scope.mailContent, originalModel);
          delete $scope.mailContent.uuid;
          delete $scope.mailContent.creationDate;
          delete $scope.mailContent.modificationDate;
          $scope.mailContent.domain = $scope.domain.identifier;
          mailContentRestService.add($scope.mailContent).then(function() {
            $modalInstance.close();
            $scope.reset();
            $state.reinit();
          });
        };
        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
          $scope.reset();
        };
        $scope.reset = function() {
          $scope.mailContent = {};
        };
        if (!_.isUndefined($scope.mailContentType)) {
          $scope.reloadModels();
        }
      }
    ]
  );
