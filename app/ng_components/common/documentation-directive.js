'use strict';

angular.module('linshareAdminApp')
  .directive('lsDoc', function($rootScope, $translate) {

    var getTemplate = function (identifier) {
      return '/i18n/templates/functionalities/' + $translate.use() + '/' + identifier + '.tpl.html';
    };

    var linker = function (scope) {

      scope.isCollapse  = false;
      scope.contentStatus  = 'CST_MORE';
      scope.seeContent  = function (){
        scope.isCollapse = !scope.isCollapse;
        scope.contentStatus = (scope.isCollapse) ? 'CST_LESS' : 'CST_MORE';
      };
      scope.template    = getTemplate(scope.functionalityDetail.identifier);
      scope.extendedTemplate = '0';

      var functionality = 'FUNCTIONALITIES.DETAILS.' + scope.functionalityDetail.identifier + '.USE_EXTENDED_DESCRIPTION';

      $translate(functionality).then(function (translations) {
        scope.extendedTemplate = translations;
      });

      $rootScope.$on('$translateChangeSuccess', function() {
        scope.template  = getTemplate(scope.functionalityDetail.identifier);
        $translate(functionality).then(function (translations) {
          scope.extendedTemplate = translations;
        });
      });
    };
    return {
      restrict: 'E',
      link: linker,
      scope: {
        functionalityDetail: '=func'
      },
      templateUrl: 'ng_components/common/documentation.tpl.html'
    }
  }
);
