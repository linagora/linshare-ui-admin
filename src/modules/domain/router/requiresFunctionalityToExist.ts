import { Router } from 'vue-router';
import { useDomainStore } from '@/modules/domain/store';
export const requiresFunctionalityToExist = (router: Router): void => {
  router.beforeEach((to) => {
    if (to.name === 'DomainFunctionality') {
      const domainStore = useDomainStore();
      const functionality = domainStore.getFunctionality(to.params.identifier as string);

      return functionality ? true : { name: 'DomainFunctionalities' };
    }
  });
};
