import { RouteRecordRaw } from 'vue-router';
import { UserRoutes } from '@/modules/user/router';
import { SharedSpacesRoutes } from '@/modules/shared-spaces/router';
import { DomainConfigurationRoute } from '@/modules/domain/router';
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
      ManageSecondFactorAuthenticationRoute,
      DomainConfigurationRoute
    ]
  }
];
