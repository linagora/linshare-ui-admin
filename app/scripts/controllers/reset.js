'use strict';

angular.module('linshareAdminApp')
  .controller('ResetCtrl',
    ['Domain', 'DomainPattern', 'DomainPolicy', 'Functionality', 'LdapConnection', 'Thread', 'User',
      function (Domain, DomainPattern, DomainPolicy, Functionality, LdapConnection, Thread, User) {
        Domain.setCurrent(undefined);
        DomainPattern.setCurrent(undefined);
        DomainPolicy.setCurrent(undefined);
        Functionality.setCurrent(undefined);
        LdapConnection.setCurrent(undefined);
        Thread.setCurrent(undefined);
        User.setCurrent(undefined);
      }
    ]
  );
