import { Router } from 'vue-router';
import { Store } from 'vuex';

export const requiresFunctionalityToExist = (router: Router, store: Store<any>): void => {
  router.beforeEach((to) => {
    if (to.name === 'DomainFunctionality') {
      const functionality = store.getters['Domain/getFunctionality'](to.params.identifier as string);

      return functionality ? true : { name: 'DomainFunctionalities' };
    }
  });
};
