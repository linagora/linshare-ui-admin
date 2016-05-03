'use strict';

angular.module('linshareAdminApp')
  .controller('InconsistentUserAllListCtrl',
    ['$scope', '$filter', '$log', 'ngTableParams', 'allInconsistents', 'User', '$q', '$modal',
    function($scope, $filter, $log, ngTableParams, allInconsistents, User, $q, $modal) {
      $scope.isCollapsed = false;
      $scope.getTemplate = function () {
        return 'INCONSISTENT_USER';
      };
      $scope.totalInconsistents = allInconsistents.length;
      $scope.getAllInconsistents = function() {
        User.getAllInconsistent().then(function(inconsistents) {
          $scope.allInconsistents = inconsistents;
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
          var orderedData = params.sorting() ?
                              $filter('orderBy')(allInconsistents, params.orderBy()) :
                              allInconsistents;
          orderedData = $filter('filter')(orderedData, params.filter());
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
      });
      $scope.selectedInconsistent = [];
      $scope.toggleSelectInconsistent = function(user) {
        if(user.isSelected) {
          $scope.selectedInconsistent.push(user);
        } else {
          var index = $scope.selectedInconsistent.indexOf(user);
          if(index > -1) {
            $scope.selectedInconsistent.splice(index, 1);
          }
        }
      };

      $scope.flagsOnSelectedPages = {};
      $scope.selectDocumentsOnCurrentPage = function(data, page, selectFlag) {
        var currentPage = page || $scope.tableParams.page();
        var dataOnPage = data || $scope.tableParams.data;
        var select = selectFlag || $scope.flagsOnSelectedPages[currentPage];
        if(!select) {
          angular.forEach(dataOnPage, function(element) {
            if(!element.isSelected) {
              element.isSelected = true;
              $scope.selectedInconsistent.push(element);
            }
          });
          $scope.flagsOnSelectedPages[currentPage] = true;
        } else {
          $scope.selectedInconsistent = _.xor($scope.selectedInconsistent, dataOnPage);
          angular.forEach(dataOnPage, function(element) {
            if(element.isSelected) {
              element.isSelected = false;
              _.remove($scope.selectedInconsistent, function(n) {
                return n.uuid === element.uuid;
              });
            }
          });
          $scope.flagsOnSelectedPages[currentPage] = false;
        }
      };

      var removeElementFromCollection = function(collection, element) {
        var index = collection.indexOf(element);
        if (index > -1) {
          collection.splice(index, 1);
        }
      };

      $scope.deleteUsers = function(selectedUsers) {
        var modalInstance = $modal.open({
          templateUrl: 'ng_components/common/confirm_modal.tpl.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            content: function() {
              return 'INCONSISTENT_USERS.CONFIRM_DELETE_FORM.PARAGRAPH';
            }
          }
        });
        modalInstance.result.then(
          function validate() {
            angular.forEach(selectedUsers, function(user, index) {
              delete user.isSelected;
              User.remove(user).then(function() {
                user.isSelected =  false;
                removeElementFromCollection(allInconsistents, user);
                selectedUsers.splice(index, 1);
                $scope.tableParams.reload();
              });
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };

      $scope.changeDomain = function(selectedUsers) {
        var modalInstance = $modal.open({
          templateUrl: 'ng_components/user/user_changedomain_modal.tpl.html',
          controller: 'ChangeDomainModalCtrl',
          resolve: {
            allDomains: function(Domain) {
              return Domain.getAll();
            },
            selectedUsers: function() {
              return selectedUsers;
            }
          }
        });
        modalInstance.result.then(
          function validate() {
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
    }]
  );
