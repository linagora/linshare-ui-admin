'use strict';

/* jshint ignore: start */
angular.module('linshareAdminApp')
  .controller('AuditFormCtrl',
    ['$rootScope', '$scope', '$filter', '$log', '$translate', '$locale', 'ngTableParams', 'Audit',
      'selectOptions', 'authenticatedUser',
    function($rootScope, $scope, $filter, $log, $translate, $locale, ngTableParams, Audit, selectOptions,
      authenticatedUser) {
      $scope.criteria = {};
      $scope.actorMails = '';
      $scope.targetMails = '';
      $scope.actorMails = authenticatedUser.mail;
      $scope.allActions = selectOptions.actions;
      $scope.allDomains = selectOptions.domains;
      $scope.opened = {
        from: false,
        to : false
      };
      // This solution is used to translate the angular ui bootstrap
      // Issue : http://stackoverflow.com/questions/19094415/how-to-translate-angular-ui-bootstrap-datepicker
      // In the futur we will need to find a better solution
      // to Parse, validate, manipulate, and display dates in JavaScript in some language
      var locales = {
        fr: {
          'DATETIME_FORMATS': {
            'AMPMS': [
              'AM',
              'PM'
            ],
            'DAY': [
              'dimanche',
              'lundi',
              'mardi',
              'mercredi',
              'jeudi',
              'vendredi',
              'samedi'
            ],
            'MONTH': [
              'janvier',
              'f\u00e9vrier',
              'mars',
              'avril',
              'mai',
              'juin',
              'juillet',
              'ao\u00fbt',
              'septembre',
              'octobre',
              'novembre',
              'd\u00e9cembre'
            ],
            'SHORTDAY': [
              'dim.',
              'lun.',
              'mar.',
              'mer.',
              'jeu.',
              'ven.',
              'sam.'
            ],
            'SHORTMONTH': [
              'janv.',
              'f\u00e9vr.',
              'mars',
              'avr.',
              'mai',
              'juin',
              'juil.',
              'ao\u00fbt',
              'sept.',
              'oct.',
              'nov.',
              'd\u00e9c.'
            ],
            'fullDate': 'EEEE d MMMM y',
            'longDate': 'd MMMM y',
            'medium': 'd MMM y HH:mm:ss',
            'mediumDate': 'd MMM y',
            'mediumTime': 'HH:mm:ss',
            'short': 'dd/MM/yy HH:mm',
            'shortDate': 'dd/MM/yy',
            'shortTime': 'HH:mm'
          },
          'NUMBER_FORMATS': {
            'CURRENCY_SYM': '\u20ac',
            'DECIMAL_SEP': ',',
            'GROUP_SEP': '\u00a0',
            'PATTERNS': [
              {
                'gSize': 3,
                'lgSize': 3,
                'macFrac': 0,
                'maxFrac': 3,
                'minFrac': 0,
                'minInt': 1,
                'negPre': '-',
                'negSuf': '',
                'posPre': '',
                'posSuf': ''
              },
              {
                'gSize': 3,
                'lgSize': 3,
                'macFrac': 0,
                'maxFrac': 2,
                'minFrac': 2,
                'minInt': 1,
                'negPre': '(',
                'negSuf': '\u00a0\u00a4)',
                'posPre': '',
                'posSuf': '\u00a0\u00a4'
              }
            ]
          },
          'id': 'fr-fr',
          'pluralCat': function(n) {
            if (n >= 0 && n <= 2 && n !== 2) {
              return PLURAL_CATEGORY.ONE;
            }
            return PLURAL_CATEGORY.OTHER;
          }
        },
        en: {
          'DATETIME_FORMATS': {
            'AMPMS': [
              'AM',
              'PM'
            ],
            'DAY': [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday'
            ],
            'MONTH': [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December'
            ],
            'SHORTDAY': [
              'Sun',
              'Mon',
              'Tue',
              'Wed',
              'Thu',
              'Fri',
              'Sat'
            ],
            'SHORTMONTH': [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec'
            ],
            'fullDate': 'EEEE, MMMM d, y',
            'longDate': 'MMMM d, y',
            'medium': 'MMM d, y h:mm:ss a',
            'mediumDate': 'MMM d, y',
            'mediumTime': 'h:mm:ss a',
            'short': 'M/d/yy h:mm a',
            'shortDate': 'M/d/yy',
            'shortTime': 'h:mm a'
          },
          'NUMBER_FORMATS': {
            'CURRENCY_SYM': '$',
            'DECIMAL_SEP': '.',
            'GROUP_SEP': ',',
            'PATTERNS': [
              {
                'gSize': 3,
                'lgSize': 3,
                'macFrac': 0,
                'maxFrac': 3,
                'minFrac': 0,
                'minInt': 1,
                'negPre': '-',
                'negSuf': '',
                'posPre': '',
                'posSuf': ''
              },
              {
                'gSize': 3,
                'lgSize': 3,
                'macFrac': 0,
                'maxFrac': 2,
                'minFrac': 2,
                'minInt': 1,
                'negPre': '(\u00a4',
                'negSuf': ')',
                'posPre': '\u00a4',
                'posSuf': ''
              }
            ]
          },
          'id': 'en-us',
          'pluralCat': function(n) {
            if (n === 1) {
              return PLURAL_CATEGORY.ONE;
            }
            return PLURAL_CATEGORY.OTHER;
          }
        }
      };

      // initializes $locale with french locale
      angular.copy(locales[$translate.use()], $locale);
      $scope.criteria.beforeDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
      $scope.criteria.afterDate = new Date();

      $rootScope.$on('$translateChangeSuccess', function() {
        // changes dt to apply the $locale changes
        angular.copy(locales[$translate.use()], $locale);

        $scope.criteria.beforeDate = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
        $scope.criteria.afterDate = new Date();
      });

      $scope.open = function(key, $event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened[key] = true;
      };
      $scope.reloadList = function() {
        $scope.tableParams.reload();
      };
      $scope.tableParams = new ngTableParams({ /* jshint ignore: line */
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          actionDate: 'desc'
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var actorMails = $scope.actorMails.trim();
          if (actorMails) {
            $scope.criteria.actorMails = actorMails.split(',');
          } else {
            $scope.criteria.actorMails = undefined;
          }
          var targetMails = $scope.targetMails.trim();
          if (targetMails) {
            $scope.criteria.targetMails = targetMails.split(',');
          } else {
            $scope.criteria.targetMails = undefined;
          }
          Audit.query($scope.criteria).then(function(logs) {
            var filteredData = params.filter() ?
                        $filter('filter')(logs, params.filter()) : logs;

            var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) :
                                logs;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
        }
      });
    }]
  );
