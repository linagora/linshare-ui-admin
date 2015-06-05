'use strict';

angular.module('linshareAdminApp').directive('lsHelp', ['$rootScope', '$translate',
  function($rootScope, $translate) {
    var getTemplate = function (content) {
      return '/i18n/templates/mainview/' + $translate.use() + '/' + content + '.tpl.html';
    };

    var linker = function(scope, element, attrs) {
      scope.template = getTemplate(scope.content);

      $rootScope.$on('$translateChangeSuccess', function () {
        scope.template = getTemplate(scope.content);
      });
    }
    return {
      restrict: 'E',
      scope: {
        content:'='
      },
      replace: true,
      link: linker,
      templateUrl: 'ng_components/common/help.tpl.html'
    };
  }
]);
