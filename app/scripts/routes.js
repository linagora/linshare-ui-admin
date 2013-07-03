'use strict';

angular.module('myApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/uploaded_files', {
      templateUrl: 'views/uploaded_files.html',
    });
    $routeProvider.when('/shared_files', {
      templateUrl: 'views/shared_files.html',
    });
    $routeProvider.when('/users', {
      templateUrl: 'views/users.html',
    });
    $routeProvider.when('/users/:userId', {
      templateUrl: 'views/user_detail.html'
    });
    $routeProvider.when('/upload', {
      templateUrl: 'views/fileupload.html'
    });
    $routeProvider.when('/tree', {
      templateUrl: 'views/tree.html'
    });
    $routeProvider.when('/threads', {
      templateUrl: 'views/threads.html'
    });
    $routeProvider.when('/threads/:threadId', {
      templateUrl: 'views/thread_detail.html'
    });
    $routeProvider.otherwise({
      redirectTo: '/shared_files'
    });
  }
]);
