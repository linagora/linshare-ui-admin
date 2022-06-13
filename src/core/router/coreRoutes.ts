import { RouteRecordRaw } from 'vue-router';
import { UserRoutes } from '@/modules/user/router';
import { SharedSpacesRoutes } from '@/modules/shared-spaces/router';
import { ManageSecondFactorAuthenticationRoute } from '@/modules/auth/router';
import { RemoteFilterRoutes } from '@/modules/remote-filter/router';
import { RemoteServerRoutes } from '@/modules/remote-server/router';
import { DomainConfigurationRoutes } from '@/modules/domain/router';
import config from '@/config';

import HomePage from '../pages/HomePage.vue';

export const CoreRoutes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    path: '/',
    redirect: config.homeRoute,
    component: HomePage,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        name: 'Configuration',
        path: 'configuration',
        component: () => import('../pages/ConfigurationPage.vue'),
        meta: {
          label: 'NAVIGATOR.CONFIGURATION',
          requiresAuth: true,
        },
        redirect: { name: 'ConfigurationEntries' },
        children: [
          {
            name: 'ConfigurationEntries',
            path: '',
            component: () => import('../components/ConfigurationEntries.vue'),
          },
          ...DomainConfigurationRoutes,
          ...RemoteFilterRoutes,
          ...RemoteServerRoutes,
        ],
      },
      {
        name: 'Administration',
        path: 'administration',
        component: () => import('../pages/AdministrationPage.vue'),
        meta: {
          label: 'NAVIGATOR.ADMINISTRATION',
          requiresAuth: true,
        },
      },
      ...UserRoutes,
      ...SharedSpacesRoutes,
      ManageSecondFactorAuthenticationRoute,
    ],
  },
];
