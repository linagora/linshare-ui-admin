import { defineStore } from 'pinia';
interface AppState {
  hydrating: boolean;
  hydrated: boolean;
  authenticating: boolean;
  authenticated: boolean;
  error: boolean;
}

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
    setError(errorState: boolean) {
      this.error = errorState;
    },
  },
});
