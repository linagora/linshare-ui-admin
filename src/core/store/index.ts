import { createStore } from 'vuex';
import Auth from '@/modules/auth/store';
import Domain from '@/modules/domain/store';
import User from '@/modules/user/store';

export interface RootState {
  hydrating: boolean;
  hydrated: boolean;
  authenticated: boolean;
  error: boolean;
}

const state: RootState = {
  hydrated: false,
  hydrating: false,
  authenticated: false,
  error: false
};

export default createStore({
  actions: {},
  getters: {
    isHydrating: (state: RootState) => state.hydrating,
    isHydrated: (state: RootState) => state.hydrated,
    isAuthenticated: (state: RootState) => state.hydrated
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
    }
  },
  state,
  modules: {
    Auth,
    Domain,
    User
  },
  strict: import.meta.env.MODE !== 'production'
});
