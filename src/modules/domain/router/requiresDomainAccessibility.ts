import { Router } from 'vue-router';
import { findDomainPage, canAccessPage } from '@/core/services/configuration-pages';
import { Store } from 'vuex';

export const requiresDomainAccessibility = (router: Router, store: Store<any>): void => {
  router.beforeEach((to) => {
    if (!to.name || !to.fullPath.includes('/configuration')) {
      return;
    }

    const domainType = store.getters['Domain/getCurrentDomainType'];
    const loggedUserRole = store.getters['Auth/getLoggedUserRole'];
    const page = findDomainPage(to.name);

    if (page && !canAccessPage(page, loggedUserRole, domainType)) {
      return '/';
    }
  });
};
