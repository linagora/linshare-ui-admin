import { Router } from 'vue-router';
import store from '@/core/store';

export const requiresAuthGuard = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (!requiresAuth) {
      return next();
    }

    if (store.getters['Auth/getLoggedUser']) {
      return next();
    }

    try {
      await store.dispatch('Auth/fetchLoggedUser');
      next();
    } catch (err) {
      console.error('Error while getting user: ', err);

      next('login');
    }
  });
};
