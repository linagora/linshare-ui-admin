import { RouteRecordRaw } from 'vue-router';
import ProvidersPage from '../pages/providers-page.vue';
export const ConfigurationDomainProvidersRoutes: RouteRecordRaw[] = [
  {
    name: 'ConfigurationDomainProviders',
    path: ':domainUuid/providers',
    component: ProvidersPage,
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.PROVIDERS',
    },
    children: [],
  },
  {
    name: 'DomainProviderManagement',
    path: '',
    component: () => import('../components/domain-provider-management.vue'),
    meta: {
      requiresAuth: true,
      parentRoute: 'Configuration',
    },
  },
  {
    name: 'DomainUserProviders',
    path: ':domainUuid/providers/user',
    component: () => import('../components/domain-user-providers.vue'),
    meta: {
      parentRoute: 'ConfigurationDomainProviders',
      label: 'NAVIGATOR.USER_PROVIDERS',
      requiresAuth: true,
    },
  },
  {
    name: 'DomainGroupProviders',
    path: ':domainUuid/providers/group',
    component: () => import('../components/domain-group-providers.vue'),
    meta: {
      parentRoute: 'ConfigurationDomainProviders',
      label: 'NAVIGATOR.GROUP_PROVIDERS',
      requiresAuth: true,
    },
  },
  {
    name: 'DomainWorkspaceProviders',
    path: ':domainUuid/providers/workspace',
    component: () => import('../components/domain-workspace-providers.vue'),
    meta: {
      parentRoute: 'ConfigurationDomainProviders',
      label: 'NAVIGATOR.WORKSPACE_PROVIDERS',
      requiresAuth: true,
    },
  },
];
