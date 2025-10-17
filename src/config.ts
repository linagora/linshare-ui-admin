import AppConfiguration from '@/core/types/AppConfiguration';

export const DEFAULT_CONFIGURATION: AppConfiguration = {
  homeRoute: '/administration',
  rootWelcomeMessageUuid: '4bc57114-c8c9-11e4-a859-37b5db95d856',
  oidcEnabled: false,
  appContext: '/',
  oidcSetting: {
    authority: 'https://auth.linshare.local',
    client_id: 'linshare',
    client_secret: 'linshare',
    scope: 'openid email profile',
    loadUserInfo: true,
  },
};

const config: AppConfiguration = {
  ...DEFAULT_CONFIGURATION,
  ...window.APP_CONFIGURATION,
};

export default config;
