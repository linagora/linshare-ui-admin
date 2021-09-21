import AppConfiguration from './core/types/AppConfiguration';

declare global {
  interface Window {
    APP_CONFIGURATION: AppConfiguration;
  }
}
