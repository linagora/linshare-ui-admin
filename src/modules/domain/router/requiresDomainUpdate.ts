import { Router } from 'vue-router';
import { Store } from 'vuex';

export const requiresDomainUpdate = (router: Router, store: Store<any>): void => {
  router.beforeEach((to, from) => {
    const domainUuid = to.params.domainUuid as string;
    const currentDomainUuid = store.getters['Domain/getCurrentDomainUuid'];

    if (!domainUuid || domainUuid === currentDomainUuid) {
      return;
    }

    store.dispatch('Domain/setCurrentDomainUuid', domainUuid);

    if (!from.path.includes('/configuration')) {
      store.dispatch('Domain/fetchDomain');
    }
  });
};
