'use strict';

angular.module('linshareAdminApp').directive('lsAuditForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {},
      controller:
        ['$scope', '$filter', '$log', 'ngTableParams', 'Domain', 'Enum', 'Audit', 'Authentication',
        function($scope, $filter, $log, ngTableParams, Domain, Enum, Audit, Authentication) {
          $scope.criteria = {};
          $scope.actorMails = '';
          $scope.targetMails = '';
          Authentication.getCurrentUser().then(function successCallback(user) {
            $scope.actorMails = user.mail;
          });
          $scope.allActions = [];
          $scope.allDomains = [];
          $scope.opened = {
            from: false,
            to : false,
          };
          Enum.getOptions('log_action', function successCallback(actions) {
            $scope.allActions = actions;
          });
          Domain.getAll(function successCallback(domains) {
            $scope.allDomains = domains;
          });
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
              $scope.criteria.actorMails = $scope.actorMails.split(',');
              $scope.criteria.targetMails = $scope.targetMails.split(',');
              Audit.query($scope.criteria, function successCallback(logs) {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')(logs, params.orderBy()) :
                                    logs;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: 'views/templates/history/audit_form.html',
      replace: false
    };
  }
]);

