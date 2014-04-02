'use strict';

angular.module('myApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/domains/ldap_connections', {
      templateUrl: 'views/domains/ldap_connections.html',
    });
    $routeProvider.when('/domains/domain_patterns', {
      templateUrl: 'views/domains/domain_patterns.html',
    });
    $routeProvider.when('/domains/management', {
      templateUrl: 'views/domains/domain_management.html',
    });

    $routeProvider.when('/parameters/functionalities', {
      templateUrl: 'views/parameters/functionalities.html',
    });

    $routeProvider.when('/parameters/mails_personalization', {
      templateUrl: 'views/parameters/mails_personalization.html',
    });

    $routeProvider.when('/users', {
      templateUrl: 'views/users.html',
    });
    $routeProvider.when('/users/management', {
      templateUrl: 'views/users/user_management.html',
    });
    $routeProvider.when('/users/threads', {
      templateUrl: 'views/users/threads.html'
    });
    $routeProvider.when('/users/mailing_lists', {
      templateUrl: 'views/users/mailing_lists.html'
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
