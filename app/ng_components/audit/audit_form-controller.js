'use strict';

angular.module('linshareAdminApp')
  .controller('AuditFormCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'Audit', 'selectOptions', 'authenticatedUser',
    function($scope, $filter, $log, ngTableParams, Audit, selectOptions, authenticatedUser) {
      $scope.criteria = {};
      $scope.actorMails = '';
      $scope.targetMails = '';
      $scope.actorMails = authenticatedUser.mail;
      $scope.allActions = selectOptions.actions;
      $scope.allDomains = selectOptions.domains;
      $scope.opened = {
        from: false,
        to : false,
      };

      $scope.open = function(key, $event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened[key] = true;
      };
      $scope.reloadList = function () {
        $scope.tableParams.reload();
      };
      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          actionDate: 'desc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var actorMails = $scope.actorMails.trim();
          if (actorMails) {
            $scope.criteria.actorMails = actorMails.split(',');
          } else {
            $scope.criteria.actorMails = undefined;
          }
          var targetMails = $scope.targetMails.trim();
          if (targetMails) {
            $scope.criteria.targetMails = targetMails.split(',');
          } else {
            $scope.criteria.targetMails = undefined;
          }
          Audit.query($scope.criteria).then(function(logs) {
            var orderedData = params.sorting() ?
                                $filter('orderBy')(logs, params.orderBy()) :
                                logs;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
        }
      });
    }]
  );
