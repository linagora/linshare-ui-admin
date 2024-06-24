import config from '@/config';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '@/core/layouts/home-page.vue';
import { UpgradesRoute } from '@/modules/upgrades/router';
import { ReportingRoute } from '@/modules/reporting/router';
import { ActivitiesRoute } from '@/modules/activities/router';
import { ConfigurationRoute } from '@/modules/configuration/router';
import { AdministrationRoute } from '@/modules/administration/router';
import { ManageSecondFactorAuthenticationRoute, ManageChangePasswordRoute } from '@/modules/auth/router';

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
      UpgradesRoute,
      ReportingRoute,
      ActivitiesRoute,
      ConfigurationRoute,
      AdministrationRoute,
      ManageSecondFactorAuthenticationRoute,
      ManageChangePasswordRoute,
    ],
  },
];
