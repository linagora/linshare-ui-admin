'use strict';

angular.module('linshareAdminApp')
  .service('Password', function Password() {
    function Rule(description, validator) {
      this.description = description;
      this.validator = function(pwd) {
        return validator(pwd);
      };
    }
    this.rules = [
      new Rule('Contain a symbol', function(pwd) {
        return pwd && /[$-/:-?{-~!"^_`\[\]]/g.test(pwd);
      }),
      new Rule('Length longer than 8 char', function(pwd) {
        return pwd && pwd.length >= 8;
      }),
      new Rule('Contain a digit', function(pwd) {
        return pwd && /[0-9]+/.test(pwd);
      }),
      new Rule('Contain an upper case character', function(pwd) {
        return pwd && /[A-Z]+/.test(pwd);
      }),
      new Rule('Contain a lower case character', function(pwd) {
        return pwd && /[a-z]+/.test(pwd);
      })
    ];

    var self = this;

    return {
      strengthScore: function(password) {
        var strength = 0;
        angular.forEach(self.rules, function(r) {
          strength += r.validator(password);
        });
        return strength * 100 / self.rules.length;
      },
      match: function(a, b) {
        return a === b;
      }
    };
  });
