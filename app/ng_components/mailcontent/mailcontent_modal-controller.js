'use strict';

angular.module('linshareAdminApp')
  .controller('mailContentModalCtrl',
    ['$scope', '$log', '$translate', '$state', '$modalInstance', 'Domain', 'Enum', 'MailContent',
      function ($scope, $log, $translate, $state, $modalInstance, Domain, Enum, MailContent) {
        Enum.getOptions('mail_content_type').then(function(options) {
          $scope.mailContentTypes = options;
        });
        Domain.getAll().then(function(domains) {
          $scope.domains = domains;
        });
        $scope.isDefined = function(x) {
          return angular.isDefined(x);
        };
        $scope.reloadModels = function(lang, domain, mailContentType) {
          if (angular.isDefined(domain) &&
              angular.isDefined(lang) &&
              angular.isDefined(mailContentType)) {
            MailContent.getAll(Domain.getId(domain), false).then(function(models) {
              $scope.models = models;
            });
          }
        };
        $scope.create = function (model) {
          var originalModel = model.originalElement;
          delete originalModel.name;
          angular.extend($scope.mailContent, originalModel);
          delete $scope.mailContent.uuid;
          delete $scope.mailContent.creationDate;
          delete $scope.mailContent.modificationDate;
          $scope.mailContent.domain = $state.params.domainId;
          MailContent.add($scope.mailContent).then(function() {
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
          $scope.mailContent = {};
        };
        $scope.reset();
      }
    ]
  );
