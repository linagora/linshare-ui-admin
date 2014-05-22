'use strict';

angular.module('linshareAdminApp').directive('lsMailForm', [
  function() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', '$filter', '$log', 'ngTableParams', 'Mail', 'User',
        function($scope, $filter, $log, ngTableParams, Mail, User) {
          $scope.reset();
          $scope.remove = function() {
            Mail.remove($scope.mail, function successCallback() {
              $scope.cancel();
            });
          };
          $scope.reset = function() {
            $scope.mail = Mail.copyCurrent();
          };
          $scope.cancel = function() {
            Mail.setCurrent(undefined);
          };
          $scope.submit = function(mail) {
            Mail.update(mail, function successCallback() {
              $scope.cancel();
            });
          };
          $scope.autocompleteUsers = function(pattern) {
            return User.autocomplete(pattern, function successCallback(users) {
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
              'lastName': $scope.contactToAdd.lastName,
            };
            Mail.addContact($scope.mail.uuid, contact, function successCallback() {
              $scope.reloadList();
              $scope.contactToAdd = undefined;
              $scope.autocompleteValue = undefined;
            });
          };
          $scope.deleteContact = function(contact) {
            Mail.removeContact($scope.mail.uuid, contact, function successCallback() {
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
              firstName: 'asc',
            }
          }, {
            debugMode: false,
            total: 0, // length of data
            getData: function($defer, params) {
              Mail.get($scope.mail.uuid, function(mail) {
                var orderedData = params.sorting() ?
                                    $filter('orderBy')(mail.contacts, params.orderBy()) :
                                    mail.contacts;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              });
            }
          });
        }
      ],
      templateUrl: 'views/templates/users/mail_form.html',
      replace: false
    };
  }
]);
