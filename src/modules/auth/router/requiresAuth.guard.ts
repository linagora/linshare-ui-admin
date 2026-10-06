import { Router } from 'vue-router';
import { useAppStore } from '@/core/store';
import { hydrate } from '@/core/store/hydrate';
import { useAuthStore } from '@/modules/auth/store';
import { signinRedirect } from '@/modules/auth/services/oidc';
import config from '@/config';

let firstLoad = true;

export const requiresAuthGuard = async (router: Router): Promise<void> => {
  router.beforeEach(async (to) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const oidcEnabled = config.oidcEnabled;
    const oidcForceRedirection = config.oidcForceRedirection;

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
      } catch (error) {
        if (oidcEnabled && oidcForceRedirection) {
          signinRedirect();
          return false;
        }

        return { name: 'Login' };
      } finally {
        appStore.setAuthenticating(false);
      }
      await hydrate();
    }
  });
};
