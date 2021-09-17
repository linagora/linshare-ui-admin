export default interface AppConfiguration {
  beta: boolean;
  legacyAppUrl: string;
}

export enum CONFIGURATION_KEY {
  BETA = 'beta',
  LEGACY_APP_URL = 'legacyAppUrl'
}
