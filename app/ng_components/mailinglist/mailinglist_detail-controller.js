'use strict';

angular.module('linshareAdminApp')
  .controller('MailingListDetailCtrl',
    ['$scope', '$filter', '$log', '$state', 'ngTableParams', 'MailingList', 'User', 'currentMailingList',
    function($scope, $filter, $log, $state, ngTableParams, MailingList, User, currentMailingList){
      $scope.mail = currentMailingList;

      $scope.remove = function() {
        MailingList.remove($scope.mail).then(function() {
          $scope.cancel();
        });
      };
      $scope.reset = function() {
        $state.reinit();
      };
      $scope.submit = function(mail) {
        MailingList.update(mail).then(function() {
          $scope.cancel();
        });
      };
      $scope.autocompleteUsers = function(pattern) {
        return User.autocomplete(pattern).then(function(users) {
          // Remove existing contacts
          angular.forEach($scope.tableParams.data, function(contact) {
            angular.forEach(users, function(user, key) {
              if (user.firstName === contact.firstName
                    && user.lastName === contact.lastName
                    && user.mail === contact.mail) {
                users.splice(key, 1);
              }
            });
          });
          return users;
        });
      };
      $scope.fieldForm = function(contactToAdd) {
        // Override the typeahead input
        $scope.autocompleteValue = contactToAdd.mail;
        $scope.contactToAdd = contactToAdd;
      };
      $scope.addContact = function() {
        var contact = {
          'mail': $scope.autocompleteValue,
          'firstName': $scope.contactToAdd.firstName,
          'lastName': $scope.contactToAdd.lastName
        };
        MailingList.addContact($scope.mail.uuid, contact).then(function() {
          $scope.reloadList();
          $scope.contactToAdd = undefined;
          $scope.autocompleteValue = undefined;
        });
      };
      $scope.deleteContact = function(contact) {
        MailingList.removeContact($scope.mail.uuid, contact).then(function() {
          $scope.reloadList();
        });
      };
      $scope.reloadList = function () {
        $scope.tableParams.reload();
      };
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
          MailingList.get($scope.mail.uuid).then(function(mail) {
            var orderedData = params.sorting() ?
                                $filter('orderBy')(mail.contacts, params.orderBy()) :
                                mail.contacts;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
        }
      });
    }]
  );

