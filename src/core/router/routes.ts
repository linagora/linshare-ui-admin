import { RouteRecordRaw } from 'vue-router';
import { LoginRoutes } from '@/modules/auth/router';
import { CoreRoutes } from '@/core/router/coreRoutes';
import { UserRoutes } from '@/modules/user/router';

export default [
  ...LoginRoutes,
  ...CoreRoutes,
  ...UserRoutes
] as Array<RouteRecordRaw>;
