import { RouteRecordRaw } from 'vue-router';
import { LoginRoutes } from '@/modules/auth/router';
import { DashboardRoutes } from '@/modules/dashboard/router';

export default [
  ...LoginRoutes,
  ...DashboardRoutes
] as Array<RouteRecordRaw>;
