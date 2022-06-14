import { Router } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/core/store';
import { useDomainStore } from '@/modules/domain/store';
/**
 * This guard will detect if a domain uuid is present in the url
 * and therefore set the current domain uuid accordingly.
 *
 * It should be registered before requiresAuthGuard where the
 * hydration is triggered.
 */
export const requiresDomainUpdate = (router: Router): void => {
  router.beforeEach((to, from) => {
    const domainStore = useDomainStore();
    const appStore = useAppStore();
    const domainUuid = to.params.domainUuid as string;
    const { currentDomain } = storeToRefs(domainStore);
    const hydrated = appStore.hydrated;

    if (!domainUuid || domainUuid === currentDomain.value.uuid) {
      return;
    }

    domainStore.setCurrentDomainUuid(domainUuid);

    if (hydrated && !from.path.includes('/configuration')) {
      domainStore.fetchDomain();
    }
  });
};
