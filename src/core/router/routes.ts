import { RouteRecordRaw } from 'vue-router';
import { LoginRoutes } from '@/modules/auth/router';
import { CoreRoutes } from '@/core/router/coreRoutes';

export default [
  ...LoginRoutes,
  ...CoreRoutes
] as Array<RouteRecordRaw>;
