window.APP_CONFIGURATION = Object.freeze({
  beta: true,
  legacyAppUrl: '/',
  oidcEnabled: false,
  oidcSetting: {
    authority: 'http://auth.linshare.local/',
    client_id: 'linshare-dev',
    client_secret: 'linshare',
    scope: 'openid email profile',
  },
});
