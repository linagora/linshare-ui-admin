import { isEnable } from '@/core/utils/functionality';
import { Router } from 'vue-router';
import { Store } from 'vuex';

export const requiresSecondFAEnabled = (router: Router, store: Store<any>): void => {
  router.beforeEach((to) => {
    if (to.name === 'ManageSecondFactorAuthentication') {
      const functionality = store.getters['Domain/getLoggedUserFunctionality']('SECOND_FACTOR_AUTHENTICATION');

      return isEnable(functionality) || '/';
    }
  });
};
