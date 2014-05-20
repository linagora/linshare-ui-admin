'use strict';

angular.module('linshareAdminApp')
  .controller('mailFooterModalCtrl',
    ['$scope', '$log', '$modalInstance', 'Domain', 'MailFooter',
      function ($scope, $log, $modalInstance, Domain, MailFooter) {
        MailFooter.getAll(Domain.getCurrent(),
          function successCallback(mailFooters) {
            $scope.model = mailFooters[0];
            $scope.models = mailFooters;
          }
        );
        $scope.modelRepresentation = function (model) {
          var lang = model.language ? 'fr' : 'en';
          return lang + ' - ' + model.name;
        };
        $scope.create = function () {
          var originalModel = $scope.model.originalElement;
          delete originalModel.name;
          angular.extend($scope.mailFooter, originalModel);
          delete $scope.mailFooter.uuid;
          delete $scope.mailFooter.creationDate;
          delete $scope.mailFooter.modificationDate;
          MailFooter.add($scope.mailFooter,
            function successCallback(mailFooter) {
              MailFooter.setCurrent(mailFooter);
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
          $scope.mailFooter = {};
        };
        $scope.reset();
      }
    ]
  );
