import { Router } from 'vue-router';
import store from '@/core/store';

export const requiresAuthGuard = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (!requiresAuth) {
      return next();
    }

    if (store.getters['Auth/getLoggedUser'] && store.getters['Auth/getSecondFA']) {
      return next();
    }

    try {
      await store.dispatch('Auth/fetchLoggedUser');
      await store.dispatch('Auth/fetchSecondFA');

      next();
    } catch (err) {
      next({ name: 'login' });
    }
  });
};
