window.APP_CONFIGURATION = Object.freeze({
  appContext: '/',
  hideLogout: false,
  oidcEnabled: false,
  oidcSetting: {
    authority: 'http://auth.linshare.local/',
    client_id: 'linshare',
    client_secret: 'linshare',
    scope: 'openid email profile',
  },
});
