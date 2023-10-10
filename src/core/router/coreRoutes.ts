import { RouteRecordRaw } from 'vue-router';
import { UserRoutes } from '@/modules/user/router';
import { SharedSpacesRoutes } from '@/modules/shared-spaces/router';
import { InconsistentUsersRoutes } from '@/modules/inconsistent-users/router';
import { ManageSecondFactorAuthenticationRoute } from '@/modules/auth/router';
import { ReportingRoute } from '@/modules/reporting/router';
import { ConfigurationRoute } from '@/modules/configuration/router';
import { ActivitiesRoute } from '@/modules/activities/router';
import { AdministrationRoute } from '@/modules/administration/router';

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
      AdministrationRoute,
      ...UserRoutes,
      ...SharedSpacesRoutes,
      ...InconsistentUsersRoutes,
      ReportingRoute,
      ManageSecondFactorAuthenticationRoute,
      ConfigurationRoute,
      ActivitiesRoute,
    ],
  },
];
