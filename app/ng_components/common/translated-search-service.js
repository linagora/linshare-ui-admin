'use strict';

angular.module('linshareAdminApp')
  .filter('translateSearchFilter', function(_, $translate, $filter){
    return function(input, param){
      if(!param){
          return input;
      }
      var searchVal = $filter('lowercase')(param);
      var result = [];
      angular.forEach(input, function(section){
        angular.forEach(section.links, function(menu){
          var translatedSection = $filter('lowercase')($filter('translate')(section.name));
          var translatedMenu = $filter('lowercase')($filter('translate')(menu.name));
          if ((translatedMenu.match(searchVal) || translatedSection.match(searchVal)) &&
              _.where(result, {'name': section.name}).length === 0) {
            result.push(section);
          }
        });
      });
      return result;
    };
  });
