import { RouteRecordRaw } from 'vue-router';
import DomainUserProvidersPage from '../pages/domain-user-providers-page.vue';
export const ConfigurationDomainDomainUserProvidersRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainDomainUserProviders',
    path: ':domainUuid/domain-user-providers',
    component: DomainUserProvidersPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
    },
    children: [],
  },
];
