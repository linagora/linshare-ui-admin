'use strict';

/*
 * An AngularJS Localization Service
 *
 * Written by ctjhoa
 * based on https://github.com/lavinjj/angularjs-localizationservice
 *
 */

angular.module('localization', [])
  // localization service responsible for retrieving resource files from the server and
  // managing the translation dictionary
  .factory('localize', ['$http', '$rootScope', '$window', '$filter', '$cookies', 'loggerService', function ($http, $rootScope, $window, $filter, $cookies, Logger) {
    var localize = {
      // use the $window service to get the language of the user's browser
      language: $cookies.linshare_lang || $window.navigator.userLanguage || $window.navigator.language,
      // flag to indicate if the service hs loaded the resource file
      resourceFileLoaded: false,

      // success handler for all server communication
      successCallback: function (data) {
        $rootScope.dictionary = data;
        // set the flag that the resource are loaded
        localize.resourceFileLoaded = true;
        $rootScope.$broadcast('localizeResourcesUpdates');
        Logger.debug('i18n data loaded');
      },

      // allows setting of language on the fly
      setLanguage: function(value) {
        $cookies.linshare_lang = value;
        localize.initLocalizedResources();
        location.reload();
      },

      // loads the language resource file from the server
      initLocalizedResources:function () {
        Logger.debug('current lang: ' +  localize.language);
        // Initialize the dictionary (hold the localized resource string entries)
        $rootScope.dictionary = {};
        // build the url to retrieve the localized resource file
        var url = '/i18n/resources-locale_' + localize.getSimpleLanguage() + '.js';
        // request the resource file
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        if (request.status !== 200) {
          var url = '/i18n/resources-locale_en.js';
          request.open('GET', url, false);
          request.send(null);
          if (request.status !== 200) {
            Logger.error('No default i18n resources found');
          }
        }
        localize.successCallback(JSON.parse(request.responseText));

        // Test if plupload needs extra translation
        if (localize.getSimpleLanguage() != "en") {
          $.getScript("/i18n/plupload/" + localize.getSimpleLanguage() + ".js")
            .fail(function(jqxhr, settings, exception) {
              Logger.debug('No plupload tanslation file, use default instead.');
            });
        }
      },
      
      // checks the dictionary for a localized resource string
      getLocalizedString: function(key) {
        // default the result to an empty string
        var result = '';

        // make sure the dictionary has valid data
        if (localize.resourceFileLoaded === true) {
          // Find the entry for the key
          var entry = $rootScope.dictionary[key];
          // if there is no entry
          if (entry) {
            // set the result
            result = entry.value;
          } else {
            Logger.warn('looking for invalid key :' + key + ' in translation');
          }
        }
        // return the value to the call
        return result;
      },
      getSimpleLanguage: function() {
        return localize.language.substring(0,2);
      }
    };
    return localize;
  }])
  // simple translation filter
  // usage {{ TOKEN | i18n }}
  .filter('i18n', ['localize', function (localize) {
    return function (input) {
      if(!input) {
        return '';
      }
      return localize.getLocalizedString(input);
    };
  }])
  // simple translation filter for ng-pluralize
  // usage {{ TOKEN_OBJECT | i18n }}
  .filter('i18nPluralize', ['localize', function (localize) {
    return function (input) {
      if(!input) {
        return '';
      }
      return input.value;
    };
  }])
  // translation directive that can handle dynamic strings
  // updates the text value of the attached element
  // usage <span data-i18n="TOKEN" ></span>
  // or
  // <span data-i18n="TOKEN|VALUE1|VALUE2" ></span>
  .directive('i18n', ['localize', function(localize){
    var i18nDirective = {
      restrict:"EAC",
      updateText: function(elm, token){
        var values = token.split('|');
        if (values.length >= 1) {
          // construct the tag to insert into the element
          var tag = localize.getLocalizedString(values[0]);
          // update the element only if data was returned
          if ((tag !== null) && (tag !== undefined) && (tag !== '')) {
            if (values.length > 1) {
              for (var index = 1; index < values.length; index++) {
                var target = '{' + (index - 1) + '}';
                tag = tag.replace(target, values[index]);
              }
            }
            // insert the text into the element
            elm.text(tag);
          };
        }
      },

      link:function (scope, elm, attrs) {
        scope.$on('localizeResourcesUpdates', function() {
          i18nDirective.updateText(elm, attrs.i18n);
        });

        attrs.$observe('i18n', function (value) {
          i18nDirective.updateText(elm, attrs.i18n);
        });
      }
    };

    return i18nDirective;
  }])
  // translation directive that can handle dynamic strings
  // updates the attribute value of the attached element
  // usage <span data-i18n-attr="TOKEN|ATTRIBUTE" ></span>
  // or
  // <span data-i18n-attr="TOKEN|ATTRIBUTE|VALUE1|VALUE2" ></span>
  .directive('i18nAttr', ['localize', function (localize) {
    var i18NAttrDirective = {
    restrict: "EAC",
    updateText:function(elm, token){
      var values = token.split('|');
      // construct the tag to insert into the element
      var tag = localize.getLocalizedString(values[0]);
      // update the element only if data was returned
      if ((tag !== null) && (tag !== undefined) && (tag !== '')) {
        if (values.length > 2) {
          for (var index = 2; index < values.length; index++) {
            var target = '{' + (index - 2) + '}';
            tag = tag.replace(target, values[index]);
          }
        }
        // insert the text into the element
        elm.attr(values[1], tag);
      }
    },
    link: function (scope, elm, attrs) {
      scope.$on('localizeResourcesUpdated', function() {
        i18NAttrDirective.updateText(elm, attrs.i18nAttr);
      });

      attrs.$observe('i18nAttr', function (value) {
        i18NAttrDirective.updateText(elm, value);
      });
    }
  };
  return i18NAttrDirective;
}]);
