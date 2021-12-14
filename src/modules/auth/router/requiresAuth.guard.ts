import { hydrate } from '@/core/store/hydrate';
import { APIError } from '@/core/types/APIError';
import { Router } from 'vue-router';
import { Store } from 'vuex';

let firstLoad = true;

export const requiresAuthGuard = async (router: Router, store: Store<any>) => {
  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (!requiresAuth) {
      return next();
    }

    if (firstLoad) {
      firstLoad = false;

      try {
        store.commit('setAuthenticating', true);
        await store.dispatch('Auth/fetchLoggedUser');
        store.commit('setAuthenticated', true);
        await hydrate();
      } catch (error) {
        if (error instanceof APIError && error.isUnauthorizedError()) {
          return next({ name: 'Login' });
        }
      } finally {
        store.commit('setAuthenticating', false);
      }
    }

    next();
  });
};
