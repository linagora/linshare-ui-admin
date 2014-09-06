'use strict';

angular.module('linshareAdminApp')
  .controller('mailFooterModalCtrl',
    ['$scope', '$log', '$translate', '$state', '$modalInstance', 'Domain', 'MailFooter',
      function ($scope, $log, $translate, $state, $modalInstance, Domain, MailFooter) {
        Domain.getAll(function(domains) {
          $scope.domains = domains;
        });
        $scope.isDefined = function(x) {
          return angular.isDefined(x);
        };
        $scope.reloadModels = function(lang, domain) {
          if (angular.isDefined(domain) &&
              angular.isDefined(lang)) {
            MailFooter.getAll(domain.identifier, false).then(function(models) {
              $scope.models = models;
            });
          }
        };
        $scope.create = function (model) {
          var originalModel = model.originalElement;
          delete originalModel.name;
          angular.extend($scope.mailFooter, originalModel);
          delete $scope.mailFooter.uuid;
          delete $scope.mailFooter.creationDate;
          delete $scope.mailFooter.modificationDate;
          $scope.mailFooter.domain = $state.params.domainId;
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
        $scope.reset();
      }
    ]
  );
