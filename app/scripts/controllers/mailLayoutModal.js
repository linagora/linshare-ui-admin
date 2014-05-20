'use strict';

angular.module('linshareAdminApp')
  .controller('mailLayoutModalCtrl',
    ['$scope', '$log', '$modalInstance', 'Domain', 'MailLayout',
      function ($scope, $log, $modalInstance, Domain, MailLayout) {
        MailLayout.getAll(Domain.getCurrent(),
          function successCallback(mailLayouts) {
            $scope.model = mailLayouts[0];
            $scope.models = mailLayouts;
          }
        );
        $scope.modelRepresentation = function (model) {
          var lang = model.language ? 'fr' : 'en';
          return lang + ' - ' + model.name;
        };
        $scope.create = function () {
          var originalModel = $scope.model.originalElement;
          delete originalModel.name;
          angular.extend($scope.mailLayout, originalModel);
          delete $scope.mailLayout.uuid;
          delete $scope.mailLayout.creationDate;
          delete $scope.mailLayout.modificationDate;
          MailLayout.add($scope.mailLayout,
            function successCallback(mailLayout) {
              MailLayout.setCurrent(mailLayout);
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
          $scope.mailLayout = {};
        };
        $scope.reset();
      }
    ]
  );
