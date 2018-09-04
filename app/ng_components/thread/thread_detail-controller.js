'use strict';

angular.module('linshareAdminApp')
  .controller('ThreadDetailCtrl',
              ['_', '$rootScope', '$scope', '$filter', '$log', '$state', 'ngTableParams', 'Thread', 'ThreadMember', 'User',
               'currentThread',
               function(_, $rootScope, $scope, $filter, $log, $state, ngTableParams, Thread, ThreadMember, User, currentThread) {
      activate();

      ////////////

      /**
       * @name activate
       * @desc Activation function of the controller, launch at every instantiation
       * @memberOf linshareAdminApp.ThreadDetailCtrl
       */
      function activate () {
        getRolesList();
      }

      /**
       * @name getRolesList
       * @desc Get roles list from server
       * @memberOf linshareAdminApp.ThreadDetailCtrl
       */
      function getRolesList() {
        ThreadMember.getRoles().then(function(roles) {
          $scope.roles = _.map(roles.plain(), function(role) {
            return {
              uuid: role.uuid,
              name: role.name
            };
          });
          $scope.selectedRole = $scope.roles[0];
        });
      }

      $scope.thread = currentThread;
      $scope.search = $state.params.search;
      $scope.reloadList = function() {
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
        member.role = (typeof $scope.selectedRole === 'string') ?
          JSON.parse($scope.selectedRole) : member.role = $scope.selectedRole;

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
              if (user.domain === threadMember.userDomainId &&
                user.mail === threadMember.userMail) {
                users.splice(key, 1);
              }
            });
          });
          return users;
        });
      };
      $scope.updateMember = function(member) {
        if(typeof member.role === 'string') {
          member.role = JSON.parse(member.role);
        }
        ThreadMember.update(member);
      };
      $scope.deleteMember = function(member) {
        ThreadMember.remove(member).then(function() {
          $scope.reloadList();
        });
      };

      $scope.$watch('userToAdd', function() {
        if($scope.tableParams.filter()['firstName']) {
          $scope.tableParams.filter()['firstName'] = '';
        }
        if($scope.tableParams.filter()['lastName']) {
          $scope.tableParams.filter()['lastName'] = '';
        }
        $scope.reloadList();
      });

      $scope.tableParams = new ngTableParams({ /* jshint ignore: line */
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
