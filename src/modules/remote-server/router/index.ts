import { RouteRecordRaw } from 'vue-router';
import { checkAccessiblePage } from '@/modules/domain/router/checkAccessiblePage';

export const RemoteServersRoute: RouteRecordRaw = {
  name: 'RemoteServersList',
  path: 'remote_servers',
  component: () => import('../components/RemoteServersList.vue'),
  beforeEnter: checkAccessiblePage,
  meta: {
    parentRoute: 'Configuration',
    label: 'NAVIGATOR.REMOTE_SERVERS',
    requiresAuth: true
  }
};
