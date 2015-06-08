'use strict';

angular.module('linshareAdminApp').directive('lsHelp', ['$rootScope', '$translate', 'Authentication',
  function($rootScope, $translate, Authentication) {
    var getTemplate = function (content) {
      return '/i18n/templates/mainview/' + $translate.use() + '/' + content + '.tpl.html';
    };

    var getDomain = function () {
      return Authentication.getCurrentUser();
    };

    var linker = function(scope, element, attrs) {
      scope.template = getTemplate(scope.content);
      getDomain().then(function (user) {
        scope.domain = user.domain;
      });
      $rootScope.$on('$translateChangeSuccess', function () {
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
