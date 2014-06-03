'use strict';

angular.module('linshareAdminApp')
  .controller('mailFooterModalCtrl',
    ['$scope', '$log', '$translate', '$modalInstance', 'Domain', 'MailFooter',
      function ($scope, $log, $translate, $modalInstance, Domain, MailFooter) {
        Domain.getAll(function(domains) {
          $scope.domains = domains;
        });
        $translate('MAIL_FOOTER.BOX_LIST.HEADER.LANGUAGE.ENGLISH').then(
          function(en) {
            $translate('MAIL_FOOTER.BOX_LIST.HEADER.LANGUAGE.FRENCH').then(
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
            MailFooter.getAll(Domain.getId(domain), false, function(models) {
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
          $scope.mailFooter.domain = Domain.getCurrentId();
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
