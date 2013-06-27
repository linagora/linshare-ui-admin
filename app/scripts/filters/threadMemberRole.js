'use strict';

//var app = angular.module('myApp.filters', []);
app.filter('role', [
  function() {
    return function(text) {
      //text = String(text).replace('<span>', '');
      //text =  String(text).replace('</span>', '');
      /*
       *        switch (text) {
       *            case 'falsetrue':
       *                return 'NORMAL';
       *            case 'falsefalse':
       *                return 'RESTRICTED';
       *            default:
       *                return 'ADMIN';
       *
       *        }
       */
      return '';
    };
  }
]);
