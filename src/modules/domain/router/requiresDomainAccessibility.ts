import { Router } from 'vue-router';
import { findDomainPage, canAccessPage } from '../helpers/domainPageManagement';
import { Store } from 'vuex';

export const requiresDomainAccessibility = (router: Router, store: Store<any>) => {
  router.beforeEach(async (to, from, next) => {
    if (
      !to.name ||
      !to.fullPath.includes('/configuration')
    ) return next();

    const domainType = store.getters['Domain/getCurrentDomainType'];
    const loggedUserRole = store.getters['Auth/getLoggedUserRole'];
    const page = findDomainPage(to.name);

    if (page && !canAccessPage(page, loggedUserRole, domainType)) {
      next('/');
    } else {
      next();
    }
  });
};
