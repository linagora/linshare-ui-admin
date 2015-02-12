'use strict';

angular.module('linshareAdminApp')
  .factory('Languages', [ '$log', '$translate', 'Enum', 'Notification',
  function ($log, $translate, Enum, Notification) {
    var languages = {
      'fr': 'FRENCH',
      'en': 'ENGLISH'
    };

    return {
  		getCurrentLang: function(){
        var current = $translate.use();
  			if (languages[current])
         return {local: current, filter: languages[current]};
        return {local: 'en', filter: 'ENGLISH'};
  		},
  		langCmp: function(lang){
        var currentLang = {};
        angular.forEach(languages, function(value, key) {
          if (value == lang || key == lang)
          {
            currentLang.filter = value;
            currentLang.local = key;
            return currentLang;
          }
        }, currentLang);
        if (!angular.equals({},currentLang))
          return currentLang;
        Notification.addError({status: 400, errCode: 20000});
        return this.getCurrentLang();
      }
    };
  }
]);