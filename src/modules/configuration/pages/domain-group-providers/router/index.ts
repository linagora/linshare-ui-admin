import { RouteRecordRaw } from 'vue-router';
import GroupProvidersPage from '../pages/group-providers-page.vue';
export const ConfigurationDomainGroupProvidersRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainGroupProviders',
    path: ':domainUuid/domain-group-providers',
    component: GroupProvidersPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
    },
    children: [],
  },
];
