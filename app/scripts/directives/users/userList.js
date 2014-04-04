'use strict';

app.directive('lsUserList', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      scope: false,
      link: function(scope, element, attrs) {
        scope.searching = false;
      },
      controller: ['$scope', '$filter', '$log', 'ngTableParams', 'User', 'localize',
        function($scope, $filter, $log, ngTableParams, User, localize) {
          $scope.reloadList = function () {
            $scope.tableParams.reload();
          };
          $scope.$watch(User.getCurrent, function (newValue, oldValue) {
            if (angular.isUndefined(newValue)) {
              $scope.reloadList();
            }
          });
          $scope.edit = function(user) {
            User.setCurrent(user);
          };
          $scope.tableParams = new ngTableParams({
            page: 1,        // show first page
            count: 10,      // count per page
            sorting: {
              lastName: 'asc',
            }
          }, {
            debugMode: true,
            total: 0, // length of data
            getData: function($defer, params) {
              var canRequest = false;
              angular.forEach(_.keys(params.filter()), function(key) {
                if (params.filter()[key].length >= 3) {
                  canRequest = true;
                }
              });
              if (canRequest) {
                User.search(params.filter(), function(users) {
                  users = params.sorting() ?
                                      $filter('orderBy')(users, params.orderBy()) :
                                      users;
                  params.total(users.length);
                  $defer.resolve(users.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                });
              }
            }
          });
        }
      ],
      templateUrl: '/views/templates/users/user_list.html',
      replace: false
    };
  }
]);
