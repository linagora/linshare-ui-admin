import { isEnable } from '@/core/utils/functionality';
import { Router } from 'vue-router';
import { useAuthStore } from '../store';

export const requiresSecondFAEnabled = (router: Router): void => {
  router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.name === 'ManageSecondFactorAuthentication') {
      return isEnable(authStore.functionalities.SECOND_FACTOR_AUTHENTICATION) || '/';
    }
  });
};
