'use strict';

angular.module('linshareAdminApp')
  .controller('UserListCtrl',
     ['_', '$scope', '$filter', '$log', '$translate', 'ngTableParams', 'User', 'authenticatedUser', '$state',
       'Restangular', '$modal',
       /* jshint maxparams: false */
      function(_, $scope, $filter, $log, $translate, ngTableParams, User, authenticatedUser, $state,
        Restangular, $modal) {
        $scope.isCollapsed = true;
        $scope.getTemplate = function() {
          return 'USER';
        };
        $scope.reloadList = function() {
          $scope.tableParams.reload();
        };
        $scope.isSuperAdmin = authenticatedUser.role === 'SUPERADMIN';

        $scope.sendFile = function(selector) {
          $scope.migStateSuccess = false;
          var csvFile = document.getElementById('fileInputCsv');
          if(selector === undefined) {
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

        var confirmCreateUserProfile = function(user) {
          var modalInstance = $modal.open({
            templateUrl: 'ng_components/common/confirm_modal.tpl.html',
            controller: 'ConfirmDialogCtrl',
            resolve: {
              content: function() {
                return 'MANAGE_USERS.CONFIRM_CREATE_PROFILE_FORM.PARAGRAPH';
              }
            }
          });
          modalInstance.result.then(
            function validate() {
              User.createUser(user).then(function(user) {
                $state.go('user.detail', {uuid: user.uuid});
              });
            }, function cancel() {
              $log.debug('Deletion modal dismissed');
            }
          );
        };

        $scope.showUserDetail = function(user) {
          User.exist(user.uuid).then(function(success) {
            if (success) {
              $state.go('user.detail', {uuid: user.uuid});
            } else {
              confirmCreateUserProfile(user);
            }
          });
        };

        $scope.tableParams = new ngTableParams({ /* jshint ignore: line */
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
  );
