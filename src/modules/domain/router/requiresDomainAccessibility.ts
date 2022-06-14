import { storeToRefs } from 'pinia';
import { Router } from 'vue-router';
import { useDomainStore } from '@/modules/domain/store';
import { useAuthStore } from '@/modules/auth/store';
import { findDomainPage, canAccessPage } from '@/core/services/configuration-pages';

export const requiresDomainAccessibility = (router: Router): void => {
  router.beforeEach((to) => {
    if (!to.name || !to.fullPath.includes('/configuration')) {
      return;
    }
    const domainStore = useDomainStore();
    const authStore = useAuthStore();
    const { currentDomain } = storeToRefs(domainStore);
    const { loggedUser } = storeToRefs(authStore);
    const page = findDomainPage(to.name);

    if (page && !canAccessPage(page, loggedUser.value?.role, currentDomain.value.type)) {
      return '/';
    }
  });
};
