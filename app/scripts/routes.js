'use strict';

angular.module('myApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/domains/ldap_connections', {
      templateUrl: 'views/domains/ldap_connections.html',
      controller: 'CreateAndEditFormCtrl'
    });
    $routeProvider.when('/domains/domain_patterns', {
      templateUrl: 'views/domains/domain_patterns.html',
      controller: 'CreateAndEditFormCtrl'
    });
    $routeProvider.when('/domains/management', {
      templateUrl: 'views/domains/domain_management.html',
      controller: 'DomainManagementCtrl'
    });

    $routeProvider.when('/administration/functionalities', {
      templateUrl: 'views/administration/functionalities.html',
    });

    $routeProvider.when('/administration/mails_personalization', {
      templateUrl: 'views/administration/mails_personalization.html',
    });
    
    $routeProvider.when('/users', {
      templateUrl: 'views/users.html',
    });
    $routeProvider.when('/users/management', {
      templateUrl: 'views/users/user_management.html',
      controller: 'UserManagementCtrl'
    });
    $routeProvider.when('/users/:userId', {
      templateUrl: 'views/user_detail.html'
    });

    $routeProvider.when('/threads', {
      templateUrl: 'views/threads/threads.html'
    });
    $routeProvider.when('/threads/:threadId', {
      templateUrl: 'views/threads/thread_detail.html'
    });

    $routeProvider.when('/mailing_lists', {
      templateUrl: 'views/mailing_lists.html'
    });

    $routeProvider.when('/audit', {
      templateUrl: 'views/audit.html'
    });
    
    $routeProvider.when('/charts', {
      templateUrl: 'views/charts.html'
    });

    $routeProvider.otherwise({
      redirectTo: '/users/management'
    });
  }
]);
