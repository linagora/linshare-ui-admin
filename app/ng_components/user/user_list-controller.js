'use strict';

angular.module('linshareAdminApp')
  .controller('UserListCtrl',
     ['$scope', '$filter', '$log', '$translate', 'ngTableParams', 'User', 'authenticatedUser',
      function ($scope, $filter, $log, $translate, ngTableParams, User, authenticatedUser) {
        $scope.isCollapsed = true;
        $scope.getTemplate = function () {
          return 'USER';
        };
        $scope.reloadList = function () {
          $scope.tableParams.reload();
        };
        $scope.isSuperAdmin = authenticatedUser.role === 'SUPERADMIN';

        $scope.sendFile = function(selector) {
          $scope.migStateSuccess = false;
          var csvFile = document.getElementById('fileInputCsv');
          if(selector == undefined) {
            selector = ';';
          }
          var formData = new FormData();
          formData.append('file', csvFile.files[0]);
          formData.append('filename', csvFile.files[0].name);
          formData.append('csvFieldDelimiter', selector);
          User.changeInternalUsersEmail(formData).then(function(state) {
            $scope.migState = state.data;
            $scope.migStateSuccess = true;
          }, function(error) {
            $scope.migState = error;
          });
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
