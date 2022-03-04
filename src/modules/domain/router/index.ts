import { RouteRecordRaw } from 'vue-router';
import DomainPage from '../pages/DomainPage.vue';

export const DomainConfigurationRoutes: RouteRecordRaw[] = [
  {
    name: 'Domain',
    path: 'domains/:domainUuid',
    component: DomainPage,
    redirect: { name: 'DomainDetails' },
    meta: {
      requiresAuth: true
    },
    children: [
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
      }
    ]
  }
];
