import { RouteRecordRaw } from 'vue-router';
import { RemoteServersRoute } from '@/modules/remote-server/router';
import { UserFilterRoutes } from '@/modules/user-filter/routes';

export const DomainConfigurationRoute: RouteRecordRaw = {
  name: 'Configuration',
  path: 'configuration',
  redirect: { name: 'DomainManagement' },
  component: () => import('../pages/DomainConfiguration.vue'),
  meta: {
    label: 'NAVIGATOR.CONFIGURATION',
    requiresAuth: true
  },
  children: [
    {
      name: 'DomainManagement',
      path: '',
      component: () => import('../components/DomainManagement.vue')
    },
    {
      name: 'DomainDetails',
      path: 'details',
      component: () => import('../components/DomainDetails.vue'),
      meta: {
        parentRoute: 'Configuration',
        label: 'NAVIGATOR.DOMAIN_DETAILS',
        requiresAuth: true
      }
    },
    {
      name: 'DomainRemoteFilters',
      path: 'filters',
      component: () => import('../components/DomainRemoteFilters.vue'),
      meta: {
        parentRoute: 'Configuration',
        label: 'NAVIGATOR.REMOTE_FILTERS',
        requiresAuth: true
      }
    },
    RemoteServersRoute,
    ...UserFilterRoutes
  ]
};
