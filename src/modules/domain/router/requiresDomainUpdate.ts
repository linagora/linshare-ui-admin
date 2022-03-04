import { Router } from 'vue-router';
import { Store } from 'vuex';

export const requiresDomainUpdate = (router: Router, store: Store<any>) => {
  router.beforeEach(async (to, from, next) => {
    const domainUuid = to.params.domainUuid as string;

    if (domainUuid) {
      store.dispatch('Domain/setCurrentDomainUuid', domainUuid);
    }

    next();
  });
};
