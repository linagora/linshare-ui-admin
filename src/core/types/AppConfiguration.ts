/* eslint-disable camelcase */
export default interface AppConfiguration {
  beta: boolean;
  rootWelcomeMessageUuid: string;
  legacyAppUrl: string;
  homeRoute: string;
  appContext: string;
  oidcEnabled: boolean;
  oidcSetting: {
    authority: string;
    client_id: string;
    client_secret: string;
    scope: string;
    loadUserInfo: boolean;
  };
}
