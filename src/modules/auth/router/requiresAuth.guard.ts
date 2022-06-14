import { APIError } from '@/core/types/APIError';
import { Router } from 'vue-router';
import { useAppStore } from '@/core/store';
import { hydrate } from '@/core/store/hydrate';
import { useAuthStore } from '@/modules/auth/store';
let firstLoad = true;

export const requiresAuthGuard = async (router: Router): Promise<void> => {
  router.beforeEach(async (to) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (!requiresAuth) {
      return;
    }

    if (firstLoad) {
      firstLoad = false;
      const authStore = useAuthStore();
      const appStore = useAppStore();
      try {
        appStore.setAuthenticating(true);
        await authStore.fetchLoggedUser();
        appStore.setAuthenticated(true);
        await hydrate();
      } catch (error) {
        if (error instanceof APIError && error.isUnauthorizedError()) {
          return { name: 'Login' };
        }
      } finally {
        appStore.setAuthenticating(false);
      }
    }
  });
};
