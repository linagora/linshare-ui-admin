'use strict';

angular.module('linshareAdminApp')
  .controller('UserListCtrl',
     ['$scope', '$filter', '$log', '$translate', 'ngTableParams', 'User',
      function ($scope, $filter, $log, $translate, ngTableParams, User) {
        $scope.isCollapsed = true;
        $scope.getTemplate = function () {
          return 'USER';
        };
        $scope.reloadList = function () {
          $scope.tableParams.reload();
        };
        $scope.tableParams = new ngTableParams({
          page: 1,        // show first page
          count: 10,      // count per page
          sorting: {
            lastName: 'asc'
          }
        }, {
          debugMode: false,
          total: 0, // length of data
          getData: function($defer, params) {
            var canRequest = false;
            angular.forEach(_.keys(params.filter()), function(key) {
              if (params.filter()[key].length >= 3) {
                canRequest = true;
              }
            });
            if (canRequest) {
              User.search(params.filter()).then(function(users) {
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
    ]
  )
  .directive('lsUserGlobal', function($rootScope){
    return {
      link: function(scope, elm) {
        elm.bind('click', function(){
          $rootScope.SelectedUserInManageUser = scope.user;
        });
      }
    }
  });
