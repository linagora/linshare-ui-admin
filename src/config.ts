import AppConfiguration from '@/core/types/AppConfiguration';

export const DEFAULT_CONFIGURATION: AppConfiguration = {
  beta: true,
  legacyAppUrl: '/',
  homeRoute: '/administration',
  oidcEnabled: false,
  oidcSetting: {
    authority: 'https://auth.linshare.local',
    client_id: 'linshare',
    client_secret: 'linshare',
    scope: 'openid email profile',
  },
};

const config: AppConfiguration = {
  ...DEFAULT_CONFIGURATION,
  ...window.APP_CONFIGURATION,
};

export default config;
