'use strict';

angular.module('linshareAdminApp').directive('lsMailList', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$filter', '$log', 'ngTableParams', 'Mail',
        function($scope, $filter, $log, ngTableParams, Mail) {
          $scope.reloadList = function () {
            $scope.tableParams.reload();
          };
          $scope.$watch(Mail.getCurrent, function (newValue, oldValue) {
            if (angular.isUndefined(newValue)) {
              $scope.reloadList();
            }
          });
          $scope.edit = function(mail) {
            Mail.setCurrent(mail);
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              identifier: 'asc',
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              Mail.getAll(function(mails) {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')(mails, params.orderBy()) :
                                    mails;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: '/views/templates/users/mail_list.html',
      replace: false
    };
  }
]);
