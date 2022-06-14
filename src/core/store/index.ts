import { defineStore } from 'pinia';
import AppState from '@/core/types/AppState';

export const useAppStore = defineStore('appStore', {
  state: (): AppState => ({
    hydrated: false,
    hydrating: false,
    authenticating: false,
    authenticated: false,
    error: false,
  }),
  actions: {
    setHydrating(hydrating: boolean) {
      this.hydrating = hydrating;
    },
    setHydrated(hydrated: boolean) {
      this.hydrated = hydrated;
    },
    setAuthenticated(authenticated: boolean) {
      this.authenticated = authenticated;
    },
    setAuthenticating(authenticating: boolean) {
      this.authenticating = authenticating;
    },
  },
});
