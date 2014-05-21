'use strict';

angular.module('linshareAdminApp')
  .controller('mailContentModalCtrl',
    ['$scope', '$log', '$translate', '$modalInstance', 'Domain', 'Enum', 'MailContent',
      function ($scope, $log, $translate, $modalInstance, Domain, Enum, MailContent) {
        MailContent.getAll(Domain.getCurrent(),
          function successCallback(mailContents) {
            $scope.models = mailContents;
          }
        );
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
        $scope.reloadModels = function(lang, domain) {
          if (angular.isDefined(domain) &&
              angular.isDefined(lang)) {
            MailContent.getAll(domain.identifier, function(models) {
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
          $scope.mailContent.mailContentType = $scope.mailContentType;
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
