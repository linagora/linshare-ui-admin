'use strict';

app.directive('lsUserList', [
  function() {
    return {
      restrict: 'A',
      transclude: true,
      scope: false,
      controller: ['$scope', 'localize', 'Restangular',
        function($scope, Localize, Restangular) {
          var allAccountType = { 
            display: Localize.getLocalizedString('P_Users-Management_AccountTypeAll'),
            value: null
          };
          $scope.accountTypes = [
            allAccountType, {
              display: Localize.getLocalizedString('P_Users-Management_AccountTypeInternal'), 
              value: 'internals'
            }, {
              display: Localize.getLocalizedString('P_Users-Management_AccountTypeGuest'),
              value: 'guests'
          }];
          $scope.accountType = allAccountType;
          $scope.searchUser = function() {
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
                });
              } else {
                return Restangular.all('users').all('search').one($scope.accountType.value, $scope.pattern).get().then(function success(users) {
                  var collection = restangularizeFromOtherURL(users);
                  successCallback(collection);
                });
              }
            }
          };

          $scope.selections = [];

          $scope.gridOptions = {
            i18n: Localize.getSimpleLanguage(),
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
                displayName: Localize.getLocalizedString('P_Users-Management_FirstName'),
              }, {
                field: 'lastName',
                displayName: Localize.getLocalizedString('P_Users-Management_LastName'),
              }, {
                field: 'mail',
                displayName: Localize.getLocalizedString('P_Users-Management_Mail'),
              }, {
                field: 'domain',
                displayName: Localize.getLocalizedString('P_Users-Management_Domain'),
              }, {
                field: 'role',
                displayName: Localize.getLocalizedString('P_Users-Management_Role'),
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
