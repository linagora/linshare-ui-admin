'use strict';

angular.module('linshareAdminApp')
  .controller('mailContentModalCtrl',
    ['$scope', '$log', '$modalInstance', 'Domain', 'Enum', 'MailContent',
      function ($scope, $log, $modalInstance, Domain, Enum, MailContent) {
        MailContent.getAll(Domain.getCurrent(),
          function successCallback(mailContents) {
            $scope.model = mailContents[0];
            $scope.models = mailContents;
          }
        );
        Enum.getOptions('mail_content_type',
          function successCallback(options) {
            $scope.mailContentType = options[0];
            $scope.mailContentTypes = options;
          }
        );
        $scope.modelRepresentation = function (model) {
          var lang = model.language ? 'fr' : 'en';
          return lang + ' - ' + model.name;
        };
        $scope.create = function () {
          var originalModel = $scope.model.originalElement;
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
