'use strict';

angular.module('linshareAdminApp').directive('lsHelp', ['$rootScope', '$translate', 'Authentication',
  function($rootScope, $translate, Authentication) {
    function getDomain() {
      return Authentication.getCurrentUser();
    }

    function getTemplate(content) {
      return '/i18n/templates/mainview/' + $translate.use() + '/' + content + '.tpl.html';
    }

    function linker(scope) {
      scope.template = getTemplate(scope.content);
      getDomain().then(function(user) {
        scope.domain = user.domain;
      });
      $rootScope.$on('$translateChangeSuccess', function() {
        scope.template = getTemplate(scope.content);
      });
    }

    return {
      restrict: 'E',
      scope: {
        content:'='
      },
      link: linker,
      templateUrl: 'ng_components/common/help.tpl.html'
    };
  }
]);
