import { isEnable } from '@/core/utils/functionality';
import { Router } from 'vue-router';
import { useDomainStore } from '@/modules/domain/store';
export const requiresSecondFAEnabled = (router: Router): void => {
  router.beforeEach((to) => {
    const domainStore = useDomainStore();
    if (to.name === 'ManageSecondFactorAuthentication') {
      const functionality = domainStore.getLoggedUserFunctionality('SECOND_FACTOR_AUTHENTICATION');

      return isEnable(functionality) || '/';
    }
  });
};
