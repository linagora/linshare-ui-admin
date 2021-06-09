import { RouteRecordRaw } from 'vue-router';
import { LoginRoutes } from '@/modules/auth/router';
import { CoreRoutes } from '@/core/router/coreRoutes';
import { UserRoutes } from '@/modules/user/router';
import { SharedSpacesRoutes } from '@/modules/shared-spaces/router';

export default [
  ...LoginRoutes,
  ...CoreRoutes,
  ...UserRoutes,
  ...SharedSpacesRoutes
] as Array<RouteRecordRaw>;
