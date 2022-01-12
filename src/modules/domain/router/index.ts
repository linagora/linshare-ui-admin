import { RouteRecordRaw } from 'vue-router';
import { RemoteServersRoute } from '@/modules/remote-server/router';
import { UserFilterRoutes } from '@/modules/user-filter/router';
import { GroupFilterRoutes } from '@/modules/group-filter/router';
import { WorkspaceFilterRoutes } from '@/modules/workspace-filter/router';

import DomainConfiguration from '../pages/DomainConfiguration.vue';
import DomainManagement from '../components/DomainManagement.vue';

export const DomainConfigurationRoute: RouteRecordRaw = {
  name: 'Configuration',
  path: 'configuration',
  redirect: { name: 'DomainManagement' },
  component: DomainConfiguration,
  meta: {
    label: 'NAVIGATOR.CONFIGURATION',
    requiresAuth: true
  },
  children: [
    {
      name: 'DomainManagement',
      path: '',
      component: DomainManagement
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
    {
      name: 'DomainProviders',
      path: 'providers',
      component: () => import('../pages/DomainProvidersPage.vue'),
      redirect: { name: 'DomainProviderManagement' },
      meta: {
        parentRoute: 'Configuration',
        label: 'NAVIGATOR.PROVIDERS',
        requiresAuth: true
      },
      children: [
        {
          name: 'DomainProviderManagement',
          path: '',
          component: () => import('../components/DomainProviderManagement.vue')
        },
        {
          name: 'DomainUserProviders',
          path: 'user',
          component: () => import('../components/DomainUserProviders.vue'),
          meta: {
            parentRoute: 'DomainProviders',
            label: 'NAVIGATOR.USER_PROVIDERS',
            requiresAuth: true
          }
        },
        {
          name: 'DomainGroupProviders',
          path: 'group',
          component: () => import('../components/DomainGroupProviders.vue'),
          meta: {
            parentRoute: 'DomainProviders',
            label: 'NAVIGATOR.GROUP_PROVIDERS',
            requiresAuth: true
          }
        },
        {
          name: 'DomainWorkspaceProviders',
          path: 'workspace',
          component: () => import('../components/DomainWorkspaceProviders.vue'),
          meta: {
            parentRoute: 'DomainProviders',
            label: 'NAVIGATOR.WORKSPACE_PROVIDERS',
            requiresAuth: true
          }
        }
      ]
    },
    RemoteServersRoute,
    ...UserFilterRoutes,
    ...GroupFilterRoutes,
    ...WorkspaceFilterRoutes
  ]
};
