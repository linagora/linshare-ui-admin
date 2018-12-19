'использовать строго';
angular.module('ngLocale', [], ['$provide', function($provide) {
  var PLURAL_CATEGORY = {ZERO: 'ноль', ONE: 'один', TWO: 'два', FEW: 'несколько', MANY: 'mмного', OTHER: 'другие'};
  $provide.value('$locale', {
    'DATETIME_FORMATS': {
      'AMPMS': [
        'AM',
        'PM'
      ],
      'Дни': [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
      ],
      'Месяцы': [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
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
    'pluralCat': function (n) {  if (n === 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
  });
}]);
