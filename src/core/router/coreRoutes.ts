import { RouteRecordRaw } from 'vue-router';
import { UserRoutes } from '@/modules/user/router';
import { SharedSpacesRoutes } from '@/modules/shared-spaces/router';
import { ManageSecondFactorAuthenticationRoute } from '@/modules/auth/router';
import { RemoteFilterRoutes } from '@/modules/remote-filter/router';
import { RemoteServerRoutes } from '@/modules/remote-server/router';
import { DomainConfigurationRoutes } from '@/modules/domain/router';
import { ReportingRoute } from '@/modules/reporting/router';
import { ConfigurationRoute } from '@/modules/configuration/router';
import { ActivitiesRoute } from '@/modules/activities/router';
import config from '@/config';

import HomePage from '../layouts/home-page.vue';

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
        name: 'Administration',
        path: 'administration',
        component: () => import('../layouts/administration-page.vue'),
        meta: {
          label: 'NAVIGATOR.ADMINISTRATION',
          requiresAuth: true,
        },
      },
      ...UserRoutes,
      ...SharedSpacesRoutes,
      ReportingRoute,
      ManageSecondFactorAuthenticationRoute,
      ConfigurationRoute,
      ActivitiesRoute,
    ],
  },
];
