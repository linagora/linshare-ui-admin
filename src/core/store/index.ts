import { createStore } from 'vuex';
import Auth from '@/modules/auth/store';
import Domain from '@/modules/domain/store';
import User from '@/modules/user/store';
import SharedSpace from '@/modules/shared-spaces/store';
import RootState from '../types/RootState';

const state: RootState = {
  hydrated: false,
  hydrating: false,
  authenticating: false,
  authenticated: false,
  error: false
};

export default createStore({
  actions: {},
  getters: {
    isHydrating: (state: RootState) => state.hydrating,
    isHydrated: (state: RootState) => state.hydrated,
    isAuthenticated: (state: RootState) => state.authenticated,
    isAuthenticating: (state: RootState) => state.authenticating
  },
  mutations: {
    setHydrating (state: RootState, hydrating: boolean) {
      state.hydrating = hydrating;
    },
    setHydrated (state: RootState, hydrated: boolean) {
      state.hydrated = hydrated;
    },
    setAuthenticated (state: RootState, authenticated: boolean) {
      state.authenticated = authenticated;
    },
    setAuthenticating (state: RootState, authenticating: boolean) {
      state.authenticating = authenticating;
    }
  },
  state,
  modules: {
    SharedSpace,
    Auth,
    Domain,
    User
  },
  strict: import.meta.env.MODE !== 'production'
});
