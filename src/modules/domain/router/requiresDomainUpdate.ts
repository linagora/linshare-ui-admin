import { Router } from 'vue-router';
import { Store } from 'vuex';

/**
 * This guard will detect if a domain uuid is present in the url
 * and therefore set the current domain uuid accordingly.
 *
 * It should be registered before requiresAuthGuard where the
 * hydration is triggered.
 */
export const requiresDomainUpdate = (router: Router, store: Store<any>): void => {
  router.beforeEach((to, from) => {
    const domainUuid = to.params.domainUuid as string;
    const currentDomainUuid = store.getters['Domain/getCurrentDomainUuid'];
    const isHydrated = store.getters.isHydrated;

    if (!domainUuid || domainUuid === currentDomainUuid) {
      return;
    }

    store.dispatch('Domain/setCurrentDomainUuid', domainUuid);

    if (isHydrated && !from.path.includes('/configuration')) {
      store.dispatch('Domain/fetchDomain');
    }
  });
};
