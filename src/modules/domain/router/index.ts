import { RouteRecordRaw } from 'vue-router';
import DomainPage from '../pages/domain-page.vue';

export const DomainConfigurationRoutes: RouteRecordRaw[] = [
  {
    name: 'Domain',
    path: 'domains/:domainUuid',
    component: DomainPage,
    redirect: { name: 'DomainDetails' },
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'DomainDetails',
        path: 'details',
        component: () => import('../components/domain-details.vue'),
        meta: {
          parentRoute: 'Configuration',
          label: 'NAVIGATOR.DOMAIN_DETAILS',
          requiresAuth: true,
        },
      },
      {
        name: 'WelcomeMessages',
        path: 'welcome_messages',
        component: () => import('../components/domain-welcome-messages-list.vue'),
        meta: {
          parentRoute: 'Configuration',
          label: 'NAVIGATOR.WELCOME_MESSAGES',
          requiresAuth: true,
        },
      },
      {
        name: 'DomainFunctionalities',
        path: 'functionalities',
        component: () => import('../components/domain-functionalities-list.vue'),
        meta: {
          parentRoute: 'Configuration',
          label: 'NAVIGATOR.FUNCTIONALITIES',
        },
      },
      {
        name: 'DomainWelcomeMessageDetails',
        path: 'welcome_messages/:uuid',
        component: () => import('../components/domain-welcome-message.vue'),
        meta: {
          parentRoute: 'WelcomeMessages',
          label: 'NAVIGATOR.WELCOME_MESSAGES_MANAGE',
          requiresAuth: true,
        },
      },
      {
        name: 'DomainFunctionality',
        path: 'functionalities/:identifier',
        component: () => import('../components/domain-functionality-details.vue'),
        meta: {
          parentRoute: 'DomainFunctionalities',
          requiresAuth: true,
        },
      },
      {
        name: 'DomainWelcomeMessageNew',
        path: 'welcome_messages/new',
        component: () => import('../components/domain-welcome-message.vue'),
        meta: {
          parentRoute: 'WelcomeMessages',
          label: 'NAVIGATOR.WELCOME_MESSAGES_NEW',
          requiresAuth: true,
        },
      },
      {
        name: 'DomainProviders',
        path: 'providers',
        component: () => import('../pages/domain-providers-page.vue'),
        redirect: { name: 'DomainProviderManagement' },
        meta: {
          parentRoute: 'Configuration',
          label: 'NAVIGATOR.PROVIDERS',
          requiresAuth: true,
        },
        children: [
          {
            name: 'DomainProviderManagement',
            path: '',
            component: () => import('../components/domain-provider-management.vue'),
          },
          {
            name: 'DomainUserProviders',
            path: 'user',
            component: () => import('../components/domain-user-providers.vue'),
            meta: {
              parentRoute: 'DomainProviders',
              label: 'NAVIGATOR.USER_PROVIDERS',
              requiresAuth: true,
            },
          },
          {
            name: 'DomainGroupProviders',
            path: 'group',
            component: () => import('../components/domain-group-providers.vue'),
            meta: {
              parentRoute: 'DomainProviders',
              label: 'NAVIGATOR.GROUP_PROVIDERS',
              requiresAuth: true,
            },
          },
          {
            name: 'DomainWorkspaceProviders',
            path: 'workspace',
            component: () => import('../components/domain-workspace-providers.vue'),
            meta: {
              parentRoute: 'DomainProviders',
              label: 'NAVIGATOR.WORKSPACE_PROVIDERS',
              requiresAuth: true,
            },
          },
        ],
      },
    ],
  },
];
