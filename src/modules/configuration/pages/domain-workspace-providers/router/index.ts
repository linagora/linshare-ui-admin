import { RouteRecordRaw } from 'vue-router';
import DomainWorkspaceProvidersPage from '../pages/domain-workspace-providers-page.vue';
export const ConfigurationDomainDomainWorkspaceProvidersRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainDomainWorkspaceProviders',
    path: ':domainUuid/domain-workspace-providers',
    component: DomainWorkspaceProvidersPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
    },
    children: [],
  },
];
