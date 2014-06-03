'use strict';

angular.module('linshareAdminApp')
  .controller('mailContentModalCtrl',
    ['$scope', '$log', '$translate', '$modalInstance', 'Domain', 'Enum', 'MailContent',
      function ($scope, $log, $translate, $modalInstance, Domain, Enum, MailContent) {
        Enum.getOptions('mail_content_type',
          function successCallback(options) {
            $scope.mailContentTypes = options;
          }
        );
        Domain.getAll(function(domains) {
          $scope.domains = domains;
        });
        $translate('MAIL_CONTENT.BOX_LIST.HEADER.LANGUAGE.ENGLISH').then(
          function(en) {
            $translate('MAIL_CONTENT.BOX_LIST.HEADER.LANGUAGE.FRENCH').then(
              function(fr) {
                $scope.languages = [en, fr];
              }
            );
          }
        );
        $scope.isDefined = function(x) {
          return angular.isDefined(x);
        };
        $scope.reloadModels = function(lang, domain, mailContentType) {
          if (angular.isDefined(domain) &&
              angular.isDefined(lang) &&
              angular.isDefined(mailContentType)) {
            MailContent.getAll(Domain.getId(domain), false, function(models) {
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
          $scope.mailContent.domain = Domain.getCurrentId();
          MailContent.add($scope.mailContent,
            function successCallback(mailContent) {
              MailContent.setCurrent(mailContent);
              $modalInstance.close();
              $scope.reset();
            }
          );
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
