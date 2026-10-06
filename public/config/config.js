window.APP_CONFIGURATION = Object.freeze({
  appContext: '/',
  hideLogout: false,
  /**
   * Configuration for OIDC authentication
   * - oidcForceRedirection: upon unauthenticated user event,
   * the page will be redirected directly to OIDC authentication portal,
   * skipping the login page
   */
  oidcEnabled: false,
  oidcForceRedirection: false,
  oidcSetting: {
    authority: 'http://auth.linshare.local/',
    client_id: 'linshare',
    client_secret: 'linshare',
    scope: 'openid email profile',
  },
});
