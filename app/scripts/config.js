angular.module('linshareAdminApp').constant('lsAppConfig', {
  backendURL: 'linshare/webservice/rest/admin',
  logoURL: undefined,
  // The licence cannot be disabled without Linagora consent
  license: true, // true to show / false to hide the license footer
  debug: true,
  productionMode: true
});
