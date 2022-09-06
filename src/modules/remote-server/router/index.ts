import { RouteRecordRaw } from 'vue-router';

export const RemoteServerRoutes: RouteRecordRaw[] = [
  {
    name: 'RemoteServersList',
    path: 'remote_servers',
    component: () => import('../components/remote-servers-list.vue'),
    meta: {
      parentRoute: 'Configuration',
      label: 'NAVIGATOR.REMOTE_SERVERS',
      requiresAuth: true,
    },
  },
];
