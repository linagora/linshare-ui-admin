import { NavigationGuard } from 'vue-router';
import { findDomainPage, canAccessPage } from '../helpers/domainPageManagement';
import store from '@/core/store';

export const checkAccessiblePage: NavigationGuard = (to, from, next) => {
  if (!to.name) {
    return next();
  }

  const domainType = store.getters['Domain/getCurrentDomainType'];
  const loggedUserRole = store.getters['Auth/getLoggedUserRole'];
  const page = findDomainPage(to.name);

  if (page && !canAccessPage(page, loggedUserRole, domainType)) {
    next('/');
  } else {
    next();
  }
};
