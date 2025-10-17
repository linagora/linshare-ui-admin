/* eslint-disable camelcase */
export default interface AppConfiguration {
  rootWelcomeMessageUuid: string;
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
