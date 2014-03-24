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
      controller: ['$scope', 'Restangular', 'localize',
        function($scope, Restangular, localize) {
          var allAccountType = { 
            display: localize.getLocalizedString('P_Users-Management_AccountTypeAll'),
            value: null
          };
          $scope.accountTypes = [
            allAccountType, {
              display: localize.getLocalizedString('P_Users-Management_AccountTypeInternal'), 
              value: 'internals'
            }, {
              display: localize.getLocalizedString('P_Users-Management_AccountTypeGuest'),
              value: 'guests'
          }];
          $scope.accountType = allAccountType;
          $scope.searchUser = function() {
            $scope.searching = true;
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
          };

          var restangularizeFromOtherURL = function(users) {
            var restangularCollection = [];
            angular.forEach(users, function(user, key) {
              restangularCollection.push(Restangular.restangularizeElement(null, user, 'users'));
            });
            return restangularCollection;
          }

          $scope.getData = function(successCallback) {
            if (!_.isUndefined($scope.pattern)) {
              if ($scope.accountType.value === null) {
                return Restangular.all('users').one('search', $scope.pattern).get().then(function success(users) {
                  var collection = restangularizeFromOtherURL(users);
                  successCallback(collection);
                  $scope.searching = false;
                });
              } else {
                return Restangular.all('users').all('search').one($scope.accountType.value, $scope.pattern).get().then(function success(users) {
                  var collection = restangularizeFromOtherURL(users);
                  successCallback(collection);
                  $scope.searching = false;
                });
              }
            }    
          };

          $scope.selections = [];
          $scope.selectedUser = {};

          $scope.$watch('selections', function(newValue, oldValue) {
            if (!_.isEmpty(newValue)) {
              angular.copy(newValue[0], $scope.selectedUser);
            } else {
              $scope.selectedUser = {};
            }
          }, true);

          $scope.$on('reloadList', function() {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
          });

          $scope.gridOptions = {
            i18n: localize.getSimpleLanguage(),
            data: 'myData',
            selectedItems: $scope.selections,
            multiSelect: false,
            keepLastSelected: false,
            enablePaging: true,
            showFooter: true,
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            columnDefs: [{
                field: 'firstName',
                displayName: localize.getLocalizedString('P_Users-Management_FirstName'),
              }, {
                field: 'lastName',
                displayName: localize.getLocalizedString('P_Users-Management_LastName'),
              }, {
                field: 'mail',
                displayName: localize.getLocalizedString('P_Users-Management_Mail'),
              }, {
                field: 'domain',
                displayName: localize.getLocalizedString('P_Users-Management_Domain'),
              }, {
                field: 'role',
                displayName: localize.getLocalizedString('P_Users-Management_Role'),
              }
            ],
            plugins: [new ngGridFlexibleHeightPlugin()]
          };
        }
      ],
      templateUrl: '/views/templates/users/user_list.html',
      replace: false
    };
  }
]);
