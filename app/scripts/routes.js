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
      templateUrl: 'views/domains/management.html',
    });

    $routeProvider.when('/administration/activation_policies', {
      templateUrl: 'views/administration/activation_policies.html',
    });

    $routeProvider.when('/administration/configuration_policies', {
      templateUrl: 'views/administration/configuration_policies.html',
    });

    $routeProvider.when('/administration/mails_personalization', {
      templateUrl: 'views/administration/mails_personalization.html',
    });
    
    $routeProvider.when('/users', {
      templateUrl: 'views/users.html',
    });
    $routeProvider.when('/users/search', {
      templateUrl: 'views/users/search.html'
    });
    $routeProvider.when('/users/:userId', {
      templateUrl: 'views/user_detail.html'
    });

    $routeProvider.when('/threads', {
      templateUrl: 'views/threads.html'
    });
    $routeProvider.when('/threads/:threadId', {
      templateUrl: 'views/thread_detail.html'
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
      redirectTo: '/domains/management'
    });
  }
]);
