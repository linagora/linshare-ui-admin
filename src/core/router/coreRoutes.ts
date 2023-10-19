import { RouteRecordRaw } from 'vue-router';
import { technicalUserRoutes } from '@/modules/administration/pages/technical-accounts/router';
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
      ...technicalUserRoutes,
      ReportingRoute,
      ManageSecondFactorAuthenticationRoute,
      ConfigurationRoute,
      ActivitiesRoute,
    ],
  },
];
