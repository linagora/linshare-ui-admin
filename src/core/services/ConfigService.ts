import AppConfiguration, { CONFIGURATION_KEY } from '../types/AppConfiguration';

export const DEFAULT_CONFIGURATION: AppConfiguration = {
  beta: true,
  legacyAppUrl: '/'
};

class ConfigService {
  config: AppConfiguration;

  constructor () {
    this.config = {
      ...DEFAULT_CONFIGURATION,
      ...window.APP_CONFIGURATION
    };
  }

  get (key: CONFIGURATION_KEY) {
    return this.config[key];
  }
}

export default new ConfigService();
