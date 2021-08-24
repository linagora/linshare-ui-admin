import { RouteRecordRaw } from 'vue-router';

import { UserRoutes } from '@/modules/user/router';
import { SharedSpacesRoutes } from '@/modules/shared-spaces/router';
import { DomainRoutes } from '@/modules/domain/router';
import { ManageSecondFactorAuthenticationRoute } from '@/modules/auth/router';

export const CoreRoutes: Array<RouteRecordRaw> = [
  {
    name: 'Home',
    path: '/',
    redirect: { name: 'Configuration' },
    component: () => import('../pages/Home.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        name: 'Configuration',
        path: 'configuration',
        redirect: { name: 'ConfigurationMain' },
        component: () => import('../pages/Configuration.vue'),
        meta: {
          label: 'NAVIGATOR.CONFIGURATION',
          requiresAuth: true
        },
        children: [
          {
            name: 'ConfigurationMain',
            path: '',
            component: () => import('../components/ConfigurationEntries.vue')
          },
          ...DomainRoutes
        ]
      },
      {
        name: 'Administration',
        path: 'administration',
        component: () => import('../pages/Administration.vue'),
        meta: {
          label: 'NAVIGATOR.ADMINISTRATION',
          requiresAuth: true
        }
      },
      ...UserRoutes,
      ...SharedSpacesRoutes,
      ManageSecondFactorAuthenticationRoute
    ]
  }
];
