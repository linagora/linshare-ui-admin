import { RouteRecordRaw } from 'vue-router';
import { LoginRoutes } from '@/modules/auth/router';
import { DashboardRoutes } from '@/modules/dashboard/router';
import { UserRoutes } from '@/modules/user/router';

export default [
  ...LoginRoutes,
  ...DashboardRoutes,
  ...UserRoutes
] as Array<RouteRecordRaw>;
