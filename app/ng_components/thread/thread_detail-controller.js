'use strict';

angular.module('linshareAdminApp')
  .controller('ThreadDetailCtrl',
    ['$rootScope', '$scope', '$filter', '$log', '$state', 'ngTableParams', 'Thread', 'ThreadMember', 'User', 'currentThread',
    function($rootScope, $scope, $filter, $log, $state, ngTableParams, Thread, ThreadMember, User, currentThread) {
      $scope.thread = currentThread;
      $scope.search = $state.params.search;
      $scope.reloadList = function () {
        $scope.tableParams.reload();
      };
      $scope.remove = function() {
        Thread.remove($scope.thread).then(function() {
          $state.go('thread.list');
        });
      };
      $scope.reset = function() {
        $state.reinit();
      };
      $scope.submit = function() {
        Thread.update($scope.thread);
      };
      $scope.addMember = function(member) {
        member.admin = $scope.userDefaultAdmin;
        member.readonly = $scope.userDefaultReadOnly;
        ThreadMember.add($scope.thread, member).then(function() {
          $scope.reloadList();
          $scope.userToAdd = undefined;
        });
      };
      $scope.autocompleteUsers = function(pattern) {
        return User.autocomplete(pattern).then(function(users) {
          // Remove existing members
          angular.forEach($scope.threadMembers, function(threadMember) {
            angular.forEach(users, function(user, key) {
              if (user.domain === threadMember.userDomainId
                    && user.mail === threadMember.userMail) {
                users.splice(key, 1);
              }
            });
          });
          return users;
        });
      };
      $scope.updateMember = function(member) {
        ThreadMember.update(member);
      };
      $scope.deleteMember = function(member) {
        ThreadMember.remove(member).then(function() {
          $scope.reloadList();
        });
      };

      $scope.$watch('userToAdd', function(n) {
        if($scope.tableParams.filter()['firstName']) {
          $scope.tableParams.filter()['firstName'] = '';
        }
        if($scope.tableParams.filter()['lastName']) {
          $scope.tableParams.filter()['lastName'] = '';
        }
        $scope.reloadList();
      });

      $scope.tableParams = new ngTableParams({
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          firstName: 'asc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          ThreadMember.getAll($scope.thread).then(function(threadMembers) {
            $scope.threadMembers = threadMembers;
            var filteredData = $filter('filter')(threadMembers, $scope.userToAdd);
            filteredData = $filter('filter')(filteredData, params.filter());
            var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
        }
      });
    }]
  );

