/* eslint-disable camelcase */
export default interface AppConfiguration {
  beta: boolean;
  legacyAppUrl: string;
  homeRoute: string;
  oidcEnabled: boolean;
  oidcSetting: {
    authority: string,
    client_id: string,
    client_secret: string,
    scope: string
  }
}
